# 📊 Data Structure Guide for NEXTVERSE

## 🎯 **How to Add Your Custom Data**

### **Method 1: Using the Data Manager (Recommended)**
1. Go to: **http://localhost:3000/data-manager**
2. Use the visual interface to add interests, courses, and exams
3. Data will be saved to console (copy and paste to JSON files)

### **Method 2: Direct JSON Editing**
Edit the files in `public/seed/` directory:
- `interests-10th.json`, `interests-12th.json`, `interests-ug.json`, `interests-pg.json`
- `courses-10th.json`, `courses-12th.json`, `courses-ug.json`, `courses-pg.json`
- `exams-10th.json`, `exams-12th.json`, `exams-ug.json`, `exams-pg.json`

---

## 📋 **Data Structure Examples**

### **1. Interests Data Structure**
```json
{
  "id": "science-10th",
  "labelKey": "interests.science",
  "descriptionKey": "interests.scienceDescription",
  "level": "10th",
  "subjects": ["Physics", "Chemistry", "Biology", "Mathematics"],
  "careerPaths": ["Engineering", "Medicine", "Research", "Teaching"]
}
```

**Required Fields:**
- `id`: Unique identifier (e.g., "science-10th")
- `labelKey`: Translation key for the interest name
- `descriptionKey`: Translation key for the description
- `level`: Education level ("10th", "12th", "UG", "PG")
- `subjects`: Array of related subjects
- `careerPaths`: Array of potential career paths

### **2. Courses Data Structure**
```json
{
  "id": "science-foundation-10th",
  "name": "Science Foundation Course",
  "level": "10th",
  "description": "Basic science concepts for 10th grade students",
  "subjects": ["Physics", "Chemistry", "Biology", "Mathematics"],
  "duration": "1 year",
  "careerPaths": ["11th Science", "Polytechnic", "ITI"],
  "nextSteps": ["11th Science", "Diploma Courses", "Vocational Training"]
}
```

**Required Fields:**
- `id`: Unique identifier
- `name`: Course name
- `level`: Education level
- `description`: Course description
- `subjects`: Array of subjects covered
- `duration`: Course duration
- `careerPaths`: Array of career paths
- `nextSteps`: Array of next educational steps

### **3. Exams Data Structure**
```json
{
  "id": "jee-main-12th",
  "name": "JEE Main",
  "level": "12th",
  "description": "Joint Entrance Examination Main",
  "eligibility": "Class 12 passed students",
  "applicationWindow": {
    "start": "2024-11-01",
    "end": "2024-12-31"
  },
  "examDate": "2025-01-15",
  "subjects": ["Physics", "Chemistry", "Mathematics"]
}
```

**Required Fields:**
- `id`: Unique identifier
- `name`: Exam name
- `level`: Education level
- `description`: Exam description
- `eligibility`: Eligibility criteria
- `applicationWindow`: Object with start and end dates
- `examDate`: Exam date
- `subjects`: Array of subjects

---

## 🛠️ **Step-by-Step Guide**

### **Step 1: Access Data Manager**
1. Open your app: http://localhost:3000
2. Navigate to: http://localhost:3000/data-manager
3. Choose the type of data you want to add (Interests, Courses, or Exams)

### **Step 2: Fill in the Form**
1. **ID**: Create a unique identifier (e.g., "my-interest-10th")
2. **Education Level**: Select the appropriate level
3. **Name/Title**: Enter the name of the interest/course/exam
4. **Description**: Add a detailed description
5. **Subjects**: Add related subjects (click + to add each one)
6. **Career Paths**: Add potential career paths
7. **Additional Fields**: Fill in level-specific fields

### **Step 3: Save and Export**
1. Click "Save" button
2. Check the browser console for the generated JSON
3. Copy the JSON data
4. Paste it into the appropriate JSON file in `public/seed/`

### **Step 4: Test Your Data**
1. Restart your development server
2. Go through the education level selection
3. Verify your custom data appears in the quiz

---

## 📁 **File Locations**

```
public/seed/
├── interests-10th.json    # 10th grade interests
├── interests-12th.json    # 12th grade interests
├── interests-ug.json      # Undergraduate interests
├── interests-pg.json     # Postgraduate interests
├── courses-10th.json      # 10th grade courses
├── courses-12th.json      # 12th grade courses
├── courses-ug.json        # Undergraduate courses
├── courses-pg.json        # Postgraduate courses
├── exams-10th.json        # 10th grade exams
├── exams-12th.json        # 12th grade exams
├── exams-ug.json          # Undergraduate exams
├── exams-pg.json         # Postgraduate exams
├── colleges.json         # College information
└── timeline.json         # Timeline events
```

---

## 🎨 **Customization Tips**

### **1. Translation Keys**
Use descriptive translation keys:
- `interests.science` → "Science"
- `interests.scienceDescription` → "Explore scientific concepts and research"

### **2. ID Naming Convention**
Use consistent naming:
- `{category}-{level}` (e.g., "science-10th", "engineering-12th")
- `{name}-{level}` (e.g., "jee-main-12th", "neet-12th")

### **3. Level-Specific Data**
- **10th**: Focus on basic subjects and career exploration
- **12th**: Include competitive exams and specialized courses
- **UG**: Advanced courses and professional development
- **PG**: Research-oriented and specialized programs

---

## 🚀 **Quick Start Examples**

### **Add a New Interest for 10th Grade:**
```json
{
  "id": "computer-science-10th",
  "labelKey": "interests.computerScience",
  "descriptionKey": "interests.computerScienceDescription",
  "level": "10th",
  "subjects": ["Computer Science", "Mathematics", "Logic"],
  "careerPaths": ["Software Engineering", "Data Science", "Cybersecurity"]
}
```

### **Add a New Course for 12th Grade:**
```json
{
  "id": "jee-preparation-12th",
  "name": "JEE Preparation Course",
  "level": "12th",
  "description": "Comprehensive JEE Main and Advanced preparation",
  "subjects": ["Physics", "Chemistry", "Mathematics"],
  "duration": "2 years",
  "careerPaths": ["Engineering", "Research", "Teaching"],
  "nextSteps": ["B.Tech", "B.E", "Integrated Programs"]
}
```

### **Add a New Exam for 12th Grade:**
```json
{
  "id": "neet-12th",
  "name": "NEET",
  "level": "12th",
  "description": "National Eligibility cum Entrance Test",
  "eligibility": "Class 12 with Physics, Chemistry, Biology",
  "applicationWindow": {
    "start": "2024-11-01",
    "end": "2024-12-31"
  },
  "examDate": "2025-05-05",
  "subjects": ["Physics", "Chemistry", "Biology"]
}
```

---

## 🎉 **You're Ready!**

Now you can easily add your custom interests, courses, and exams to make NEXTVERSE truly personalized for your users!
