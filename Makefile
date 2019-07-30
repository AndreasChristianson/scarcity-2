git_sha=$(shell git rev-parse --short HEAD)
layer_dir=lambda-layer
layer_version=$(shell npm --prefix $(layer_dir) --silent run get-version)
lambda_dir=lambdas
site_dir=site

.DELETE_ON_ERROR:

$(layer_dir)/node_modules/layer.zip:
	rm -rf $(layer_dir)/node_modules
	npm --prefix $(layer_dir) install --production
	zip -rqX $(layer_dir)/node_modules/layer.zip $(layer_dir)/node_modules

layer_upload: $(layer_dir)/node_modules/layer.zip
	aws s3 cp $(layer_dir)/node_modules/layer.zip s3://scarcity-artifacts/layer/$(layer_version).zip

$(lambda_dir)/dist/app.zip:
	npm --prefix $(lambda_dir) install
	npm --prefix $(lambda_dir) run build
	cd $(lambda_dir)/dist; zip -rX app.zip .
	# rm -rf $(lambda_dir)/node_modules
	# npm --prefix $(lambda_dir) install --production
	# cd $(lambda_dir); zip -rqX dist/app.zip node_modules

lambdas_upload: $(lambda_dir)/dist/app.zip
	aws s3 cp $(lambda_dir)/dist/app.zip s3://scarcity-artifacts/$(git_sha)/lambdas/app.zip

$(site_dir)/dist:
	npm --prefix $(site_dir) install
	npm --prefix $(site_dir) run build

site_upload: $(site_dir)/dist
	aws s3 cp $(site_dir)/dist s3://scarcity-artifacts/$(git_sha)/site/ --recursive


template_upload:
	aws s3 cp templates s3://scarcity-artifacts/$(git_sha)/templates/ --recursive

upload: template_upload site_upload lambdas_upload layer_upload
