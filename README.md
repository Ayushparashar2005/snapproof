# SnapProof - AI Fake Image Detector with Legal Report

SnapProof is a mobile application that uses artificial intelligence to detect image tampering and generate forensic reports with legal implications. Upload any suspicious image and get instant analysis with visual overlays, technical findings, and potential cyber law violations.

## 🚀 Features

- **Visual Tampering Detection**: Advanced Error Level Analysis (ELA) and MediaPipe integration
- **Legal Assessment**: Automatic flagging of potential cyber law violations under IT Act and Evidence Act
- **Forensic Reports**: Comprehensive PDF reports with technical analysis and legal implications
- **Visual Overlays**: Interactive highlighting of suspicious regions in images
- **Metadata Analysis**: Deep examination of EXIF data and compression artifacts
- **Local Processing**: Node.js server for image analysis

## 🏗️ Architecture

```
Mobile App (React Native)
      ↓ upload image
Local Server (Node.js + Express)
      ↓ processes image
CV Pipeline (Mock Analysis)
      ↓ detects tampered regions, extracts metadata
NLP Layer (Legal Analysis)
      ↓ generates report
Returns annotated image + PDF report to app
```

## 📱 Mobile App

### Technology Stack
- **React Native** for cross-platform mobile development
- **React Navigation** for app navigation
- **Vector Icons** for UI components
- **Image Picker** for camera/gallery access
- **PDF Generation** for report creation

### Key Components
- **HomeScreen**: Image upload interface
- **AnalysisScreen**: Real-time analysis progress
- **ReportScreen**: Comprehensive forensic report display
- **ImageOverlay**: Visual tampering region highlighting

## 🖥️ Local Backend

### Server Components
- **uploadImage**: Handles image uploads with validation
- **analyzeImage**: Core analysis pipeline (CV + NLP)
- **health**: Server health check endpoint

### Computer Vision Pipeline
- **Error Level Analysis**: Detects compression inconsistencies
- **Region Detection**: Face and object detection
- **Metadata Extraction**: EXIF data analysis
- **Compression Analysis**: Multi-level compression detection

### Legal Analysis
- **IT Act 2000**: Sections 43, 65B, 66A
- **Indian Evidence Act**: Electronic record authenticity
- **Risk Assessment**: High/Medium/Low classification

## 🛠️ Installation

### Prerequisites
- Node.js 16+
- React Native CLI

### Mobile App Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/SnapProof.git
   cd SnapProof
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

### Local Backend Setup

1. **Start the local server**
   ```bash
   node start-local-server.js
   ```

2. **Verify server is running**
   ```bash
   curl http://localhost:3000/health
   ```

## 📊 Analysis Process

### 1. Image Upload
- File validation (JPEG, PNG, WebP)
- Size limit (10MB)
- Local server processing

### 2. Computer Vision Analysis
- **Error Level Analysis**: Quantifies manipulation artifacts
- **Compression Detection**: Identifies multiple compression levels
- **Region Detection**: Flags suspicious areas using MediaPipe
- **Metadata Verification**: Checks EXIF consistency

### 3. Legal Assessment
- **Evidence Tampering**: IT Act Section 66A
- **Record Authenticity**: Evidence Act Section 65B
- **Data Modification**: IT Act Section 43
- **Risk Classification**: High/Medium/Low

### 4. Report Generation
- **Visual Overlays**: Highlighted tampering regions
- **Technical Summary**: ELA scores, compression analysis
- **Legal Findings**: Applicable cyber law sections
- **PDF Export**: Professional forensic report

## 🔧 Configuration

### Mobile App Configuration

The mobile app is already configured to connect to the local server at `http://localhost:3000`. No additional configuration needed.

### Server Configuration

The local server includes these default settings:

- **Port**: 3000
- **Max File Size**: 10MB
- **Supported Formats**: JPEG, PNG, WebP
- **Upload Endpoint**: `/upload`
- **Analysis Endpoint**: `/analyze`

## 📱 Usage

1. **Start the local server**: `node start-local-server.js`
2. **Launch SnapProof** on your mobile device
3. **Upload an image** using camera or gallery
4. **Wait for analysis** - real-time progress shown
5. **View results** with visual overlays and risk assessment
6. **Generate PDF report** for legal documentation
7. **Share findings** with stakeholders

## 🎯 Use Cases

- **Legal Proceedings**: Evidence verification in court cases
- **Journalism**: Photo authenticity verification
- **Insurance**: Claim documentation validation
- **Social Media**: Fake news detection
- **Corporate**: Document tampering detection

## ⚖️ Legal Framework

### Indian Cyber Law Coverage
- **IT Act 2000**: Sections 43, 65B, 66A
- **Indian Evidence Act**: Electronic record provisions
- **Criminal Procedure Code**: Digital evidence handling

### Compliance Notes
- **Local Processing**: All data stays on your local machine
- **Privacy**: No external data transmission
- **Forensic Standards**: Follows digital evidence best practices

## 🔒 Security Features

- **Local processing**: Image data stays on your local network
- **Temporary storage**: Automatic cleanup of uploaded files
- **Access control**: Secure API endpoints
- **Data privacy**: No external data transmission
- **Audit logging**: Analysis tracking

## 🚀 Performance

- **Analysis time**: < 5 seconds per image (local processing)
- **Accuracy**: Mock analysis with realistic results
- **Scalability**: Local server handles concurrent requests
- **Offline capability**: Fully functional without internet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check QUICK_START.md for detailed instructions
- **Issues**: Report bugs via GitHub Issues
- **Local Setup**: Follow the quick start guide

## 🔄 Version History

- **v1.0.0**: Local version with complete functionality
- **v1.0.1**: Removed cloud dependencies for simplified deployment

---

**Disclaimer**: SnapProof provides mock analysis for demonstration purposes. For real forensic analysis, please use professional tools and consult qualified experts. Legal findings should be verified by legal professionals for court proceedings.
