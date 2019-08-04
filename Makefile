git_sha=$(shell git rev-parse --short HEAD)
layer_dir=lambda-layer
layer_version=$(shell npm --prefix $(layer_dir) --silent run get-version)
lambda_dir=lambdas
site_dir=site

.DELETE_ON_ERROR:

$(layer_dir)/node_modules/layer.zip: $(layer_dir)/package*
	rm -rf $(layer_dir)/node_modules
	npm --prefix $(layer_dir) install --production
	zip -rqX $(layer_dir)/node_modules/layer.zip $(layer_dir)/node_modules

$(layer_dir)/node_modules/layer.zip.uploaded: $(layer_dir)/node_modules/layer.zip
	aws s3 cp $(layer_dir)/node_modules/layer.zip s3://scarcity-artifacts/layer/$(layer_version).zip
	touch $(layer_dir)/node_modules/layer.zip.uploaded

$(lambda_dir)/dist/app.zip: $(lambda_dir)/src/* $(lambda_dir)/package* $(lambda_dir)/.babelrc
	npm --prefix $(lambda_dir) install
	npm --prefix $(lambda_dir) run build
	cd $(lambda_dir)/dist; zip -rX app.zip .
	rm -rf $(lambda_dir)/node_modules
	npm --prefix $(lambda_dir) install --production
	cd $(lambda_dir); zip -rqX dist/app.zip node_modules

$(lambda_dir)/dist/app.zip.uploaded: $(lambda_dir)/dist/app.zip
	aws s3 cp $(lambda_dir)/dist/app.zip s3://scarcity-artifacts/$(git_sha)/lambdas/app.zip
	touch $(lambda_dir)/dist/app.zip.uploaded

$(site_dir)/dist: $(site_dir)/package* $(site_dir)/src/* $(site_dir)/static/*
	npm --prefix $(site_dir) install
	npm --prefix $(site_dir) run build

$(site_dir)/dist/.uploaded: $(site_dir)/dist
	aws s3 cp $(site_dir)/dist s3://scarcity-artifacts/$(git_sha)/site/ --recursive
	touch $(site_dir)/dist/.uploaded

template.json: templates/*
	pip install --user troposphere[policy]
	python templates/template.py --env $(env) --sha $(git_sha) --layer $(layer_version) > template.json

# template_upload:
# 	aws s3 cp templates s3://scarcity-artifacts/$(git_sha)/templates/ --recursive

upload: $(site_dir)/dist/.uploaded $(lambda_dir)/dist/app.zip.uploaded $(layer_dir)/node_modules/layer.zip.uploaded 

deploy: upload template.json
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
	# aws s3 sync s3://scarcity-artifacts/${git_sha}/site/ s3://scarcity-site-$env/ --delete
	# aws apigatewayv2 create-deployment \
	# 	--api-id $(getOutput WssApiId) \
	# 	--stage-name $env \
	# 	--description ${git_sha}


# aws cloudformation describe-stacks  --stack-name scarcity-$(env) | jq --raw-output ".Stacks[0].Outputs[] | select(.OutputKey == \"WssApiId\") | .OutputValue"
