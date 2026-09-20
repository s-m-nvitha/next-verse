# 📝 Text Data Import Guide

## 🎯 **How to Add Your Text Data to NEXTVERSE**

### ✅ **3 Easy Ways to Import Your Text Data:**

---

## **Method 1: Text Converter (Recommended)**
**URL**: http://localhost:3000/text-converter

### **Step-by-Step:**
1. **Go to**: http://localhost:3000/text-converter
2. **Choose**: Data type (Interests, Courses, or Exams)
3. **Select**: Education level (10th, 12th, UG, PG)
4. **Paste**: Your text data
5. **Convert**: Click "Convert to JSON"
6. **Download**: Copy or download the JSON
7. **Add to app**: Paste into appropriate file in `public/seed/`

---

## **Method 2: Bulk Importer**
**URL**: http://localhost:3000/data-manager

### **Step-by-Step:**
1. **Go to**: http://localhost:3000/data-manager
2. **Use**: The visual interface to add data
3. **Fill forms**: For each interest, course, or exam
4. **Save**: Copy JSON from console
5. **Add to app**: Paste into JSON files

---

## **Method 3: Direct File Editing**
**Location**: `public/seed/` directory

### **Step-by-Step:**
1. **Open**: JSON files in `public/seed/` directory
2. **Edit**: Add your data following the structure
3. **Save**: Files and restart your app
4. **Test**: Check if data appears in quiz

---

## 📋 **Text Format Examples**

### **1. Simple List Format (Line by Line)**
```
Science
Mathematics
Technology
Arts
Commerce
Engineering
Medicine
Law
Business
Research
```

### **2. Structured Format**
```
Name: Science Foundation Course
Description: Basic science concepts for 10th grade
Subjects: Physics, Chemistry, Biology, Mathematics
Duration: 1 year

Name: Mathematics Advanced
Description: Advanced mathematics for 10th grade
Subjects: Algebra, Geometry, Trigonometry
Duration: 1 year
```

### **3. Custom Format (Pipe Separated)**
```
JEE Main | Joint Entrance Examination Main | Physics, Chemistry, Mathematics
NEET | National Eligibility cum Entrance Test | Physics, Chemistry, Biology
GATE | Graduate Aptitude Test in Engineering | Computer Science, Mathematics
```

---

## 🛠️ **Supported Text Formats**

### **For Interests:**
- **Simple**: One interest per line
- **Structured**: Use "Name:", "Description:" format
- **Custom**: Use "|" to separate fields

### **For Courses:**
- **Simple**: One course name per line
- **Structured**: Include name, description, subjects, duration
- **Custom**: Use "|" to separate: Name | Description | Subjects

### **For Exams:**
- **Simple**: One exam name per line
- **Structured**: Include name, description, eligibility, dates
- **Custom**: Use "|" to separate: Name | Description | Subjects

---

## 📁 **File Locations**

After converting your data, add it to these files:

```
public/seed/
├── interests-10th.json    # 10th grade interests
├── interests-12th.json    # 12th grade interests
├── interests-ug.json      # Undergraduate interests
├── interests-pg.json     # Postgraduate interests
├── courses-10th.json     # 10th grade courses
├── courses-12th.json     # 12th grade courses
├── courses-ug.json       # Undergraduate courses
├── courses-pg.json       # Postgraduate courses
├── exams-10th.json       # 10th grade exams
├── exams-12th.json       # 12th grade exams
├── exams-ug.json         # Undergraduate exams
└── exams-pg.json         # Postgraduate exams
```

---

## 🎨 **Data Structure Examples**

### **Interests JSON Structure:**
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

### **Courses JSON Structure:**
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

### **Exams JSON Structure:**
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

---

## 🚀 **Quick Start Examples**

### **Example 1: Add 10th Grade Interests**
1. **Text Input:**
```
Science
Mathematics
Technology
Arts
Commerce
```

2. **Go to**: http://localhost:3000/text-converter
3. **Select**: Interests, 10th Grade, Line by Line
4. **Paste**: Your text
5. **Convert**: Get JSON output
6. **Add to**: `public/seed/interests-10th.json`

### **Example 2: Add 12th Grade Courses**
1. **Text Input:**
```
Name: JEE Preparation Course
Description: Comprehensive JEE Main and Advanced preparation
Subjects: Physics, Chemistry, Mathematics
Duration: 2 years

Name: NEET Preparation Course
Description: Complete NEET preparation with mock tests
Subjects: Physics, Chemistry, Biology
Duration: 1 year
```

2. **Go to**: http://localhost:3000/text-converter
3. **Select**: Courses, 12th Grade, Structured Text
4. **Paste**: Your text
5. **Convert**: Get JSON output
6. **Add to**: `public/seed/courses-12th.json`

### **Example 3: Add Undergraduate Exams**
1. **Text Input:**
```
GATE CS | Graduate Aptitude Test in Engineering - Computer Science | Programming, Algorithms, Computer Networks
CAT | Common Admission Test | Quantitative Aptitude, Verbal Ability, Data Interpretation
UPSC | Union Public Service Commission | General Studies, Optional Subjects
```

2. **Go to**: http://localhost:3000/text-converter
3. **Select**: Exams, UG, Custom Format
4. **Paste**: Your text
5. **Convert**: Get JSON output
6. **Add to**: `public/seed/exams-ug.json`

---

## 🎯 **Tips for Success**

### **1. Text Formatting:**
- Use consistent formatting
- One item per line for simple lists
- Use clear separators (| or :)
- Include all relevant information

### **2. Data Quality:**
- Use descriptive names
- Include relevant subjects
- Add career paths for interests
- Include dates for exams

### **3. Testing:**
- Always test after adding data
- Check browser console for errors
- Verify data appears in quiz
- Restart development server if needed

---

## 🎉 **You're Ready!**

Now you can easily convert your text data into the proper JSON format for NEXTVERSE. Choose the method that works best for you and start adding your custom education data!
