# 🚀 SnapProof Quick Start Guide

## ✅ Current Status
- **Local Server**: ✅ Running on http://localhost:3000
- **Mobile App**: ✅ Dependencies installed
- **Cloud Functions**: ✅ Ready for deployment

## 🎯 Quick Test Steps

### 1. Start the Local Server
```bash
cd SnapProof
node start-local-server.js
```
Server should show:
```
🚀 SnapProof Local Server running on http://localhost:3000
📊 Health check: http://localhost:3000/health
📤 Upload endpoint: http://localhost:3000/upload
🔍 Analysis endpoint: http://localhost:3000/analyze
```

### 2. Test Server Health
Open browser or curl:
```bash
curl http://localhost:3000/health
```
Should return:
```json
{
  "status": "healthy",
  "service": "SnapProof Local Server",
  "timestamp": "2026-04-29T15:57:27.203Z"
}
```

### 3. Run Mobile App

#### Option A: Web Version (Easiest)
```bash
npx react-native run-web
```

#### Option B: Android (Requires Android Studio)
```bash
npx react-native run-android
```

#### Option C: iOS (Requires Xcode)
```bash
npx react-native run-ios
```

### 4. Test the App
1. Open SnapProof on your device/emulator
2. Click "Take Photo" or "Choose from Gallery"
3. Select any image
4. Watch the analysis progress
5. View the forensic report with:
   - Visual overlays showing tampered regions
   - Risk assessment (High/Medium/Low)
   - Legal violations under IT Act
   - Technical analysis details

## 📱 What You'll See

### Home Screen
- Camera and Gallery upload buttons
- Clean, modern UI with SnapProof branding

### Analysis Screen
- Real-time progress indicators
- Step-by-step analysis display
- Professional loading animations

### Report Screen
- **Visual Overlays**: Red/Orange/Yellow regions showing tampering
- **Risk Assessment**: Color-coded risk levels
- **Technical Details**: ELA scores, compression analysis
- **Legal Assessment**: IT Act violations
- **PDF Export**: Generate professional reports
- **Share Options**: Send analysis results

## 🔧 Troubleshooting

### Server Issues
```bash
# Check if server is running
curl http://localhost:3000/health

# Restart server
node start-local-server.js
```

### Mobile App Issues
```bash
# Clear cache
npx react-native start --reset-cache

# Reinstall dependencies
npm install
npx react-native run-android --reset-cache
```

### Android Setup
1. Install Android Studio
2. Create an AVD (Android Virtual Device)
3. Set ANDROID_HOME environment variable
4. Run `npx react-native doctor`

### iOS Setup
1. Install Xcode from App Store
2. Install Xcode Command Line Tools
3. Run `npx react-native doctor`

## 🎯 Test Images to Try

Use these test scenarios to see the analysis in action:

1. **Screenshots**: Often show manipulation artifacts
2. **Edited photos**: Any photo with filters or edits
3. **Document scans**: Check for tampering
4. **Social media images**: Test compression analysis

## 📊 Expected Results

### Low Risk Images
- Original photos with minimal editing
- Consistent metadata
- Low ELA scores (< 20%)

### Medium Risk Images
- Lightly edited photos
- Some metadata inconsistencies
- Moderate ELA scores (20-50%)

### High Risk Images
- Heavily manipulated images
- Multiple compression levels
- High ELA scores (> 50%)
- Clear legal violations detected

## 🚀 Production Deployment

When ready for production:

### Local Development
The app is already configured for local development with the server running on localhost:3000.

### Future Cloud Deployment
For production deployment, you can:
1. Deploy the local server to a cloud provider (AWS, Google Cloud, Azure)
2. Update the mobile app URLs in `src/services/ImageAnalysisService.js`
3. Configure environment variables for production

## 🎉 Success Indicators

✅ Server responds to health checks  
✅ Mobile app launches without errors  
✅ Image upload works  
✅ Analysis completes with results  
✅ Visual overlays appear on suspicious regions  
✅ PDF reports generate successfully  
✅ Legal violations are detected  

## 📞 Support

If you encounter issues:
1. Check the server is running (curl localhost:3000/health)
2. Verify mobile app dependencies (npm install)
3. Check Android/iOS setup (npx react-native doctor)
4. Review logs for error messages

**SnapProof is now ready for testing! 🎯**
