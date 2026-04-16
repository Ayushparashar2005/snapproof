#!/bin/bash

# SnapProof Azure Deployment Script
# This script deploys the cloud functions and infrastructure

echo "🚀 Deploying SnapProof to Azure..."

# Variables
RESOURCE_GROUP="SnapProof-RG"
LOCATION="eastus"
FUNCTION_APP="snapproof-functions"
STORAGE_ACCOUNT="snapproofstorage"
APP_SERVICE_PLAN="snapproof-plan"

echo "📦 Creating resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

echo "🗄️ Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

echo "🔧 Creating function app..."
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --functions-version 4 \
  --name $FUNCTION_APP \
  --storage-account $STORAGE_ACCOUNT

echo "⚙️ Configuring function app settings..."
az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    "FUNCTIONS_WORKER_RUNTIME=node" \
    "WEBSITE_RUN_FROM_PACKAGE=1" \
    "ENABLE_ORYX_BUILD=true"

echo "📤 Deploying functions..."
cd cloud/functions
func azure functionapp publish $FUNCTION_APP --node

echo "🔗 Getting function URLs..."
FUNCTION_BASE_URL=$(az functionapp function show \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --function-name analyzeImage \
  --query invokeUrlTemplate \
  --output tsv | sed 's/analyzeImage//')

echo "✅ Deployment complete!"
echo "📋 Function URLs:"
echo "Upload: ${FUNCTION_BASE_URL}uploadImage"
echo "Analyze: ${FUNCTION_BASE_URL}analyzeImage"
echo "Cleanup: ${FUNCTION_BASE_URL}cleanup"

# Update mobile app configuration
echo "📱 Updating mobile app configuration..."
cd ../..
sed -i.bak "s|https://your-cloud-backend.com|${FUNCTION_BASE_URL}|g" src/services/ImageAnalysisService.js

echo "🎉 SnapProof deployment completed successfully!"
echo "📖 Please update your mobile app with the new backend URLs"
