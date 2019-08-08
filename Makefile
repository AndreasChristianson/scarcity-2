git_sha=$(shell git rev-parse --short HEAD)
layer_dir=lambda-layer
layer_version=$(shell npm --prefix $(layer_dir)/nodejs --silent run get-version)
lambda_dir=lambdas
site_dir=site

.DELETE_ON_ERROR:

check-env:
ifndef env
	$(error env is undefined)
endif

clean:
	git clean -dfx

$(layer_dir)/nodejs/node_modules/layer.zip: $(layer_dir)/nodejs/package*
	rm -rf $(layer_dir)/nodejs/node_modules
	npm --prefix $(layer_dir)/nodejs install --production
	cd $(layer_dir); zip -rqX nodejs/node_modules/layer.zip nodejs/node_modules

$(layer_dir)/nodejs/node_modules/${git_sha}.uploaded: $(layer_dir)/nodejs/node_modules/layer.zip
	aws s3 cp $(layer_dir)/nodejs/node_modules/layer.zip s3://scarcity-artifacts/layer/$(layer_version).zip
	touch $(layer_dir)/nodejs/node_modules/${git_sha}.uploaded

$(lambda_dir)/dist/app.zip: $(shell find $(lambda_dir)/src -type f) $(lambda_dir)/src $(lambda_dir)/package* $(lambda_dir)/.babelrc
	npm --prefix $(lambda_dir) install
	npm --prefix $(lambda_dir) run build
	cd $(lambda_dir)/dist; zip -rX app.zip .
	# rm -rf $(lambda_dir)/node_modules
	# npm --prefix $(lambda_dir) install --production
	# cd $(lambda_dir); zip -rqX dist/app.zip node_modules

$(lambda_dir)/dist/${git_sha}.uploaded: $(lambda_dir)/dist/app.zip
	aws s3 cp $(lambda_dir)/dist/app.zip s3://scarcity-artifacts/$(git_sha)/lambdas/app.zip
	touch $(lambda_dir)/dist/${git_sha}.uploaded

$(site_dir)/dist: $(shell find $(site_dir)/static -type f) $(shell find $(site_dir)/src -type f) $(site_dir)/package* $(site_dir)/src $(site_dir)/static
	npm --prefix $(site_dir) install
	npm --prefix $(site_dir) run build

$(site_dir)/dist/${git_sha}.uploaded: $(site_dir)/dist
	aws s3 cp $(site_dir)/dist s3://scarcity-artifacts/$(git_sha)/site/ --recursive
	touch $(site_dir)/dist/${git_sha}.uploaded

template.json: templates/*.py check-env
	python templates/template.py --env $(env) --sha $(git_sha) --layer $(layer_version) > template.json

upload: $(site_dir)/dist/${git_sha}.uploaded $(lambda_dir)/dist/${git_sha}.uploaded $(layer_dir)/nodejs/node_modules/${git_sha}.uploaded 

deploy: upload template.json check-env
	aws cloudformation validate-template --template-body file://template.json
	./spin.sh \
		aws cloudformation deploy \
			--template-file template.json \
			--stack-name scarcity-$(env) \
			--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
			--tags \
			env=$(env) \
			project=scarcity \
			--no-fail-on-empty-changeset
	aws s3 sync s3://scarcity-artifacts/${git_sha}/site/ s3://scarcity-site-$(env)/ --delete
	aws apigatewayv2 create-deployment \
		--api-id $(shell aws cloudformation describe-stacks  --stack-name scarcity-$(env) --query "Stacks[0].Outputs[?OutputKey=='WssApiId'].OutputValue" --output text) \
		--stage-name $(env) \
		--description ${git_sha}


