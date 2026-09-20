import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Download, FileText, CheckCircle } from 'lucide-react'

interface ConvertedData {
  interests: any[]
  courses: any[]
  exams: any[]
}

export default function TextDataConverter() {
  const [inputText, setInputText] = useState('')
  const [dataType, setDataType] = useState<'interests' | 'courses' | 'exams'>('interests')
  const [educationLevel, setEducationLevel] = useState('10th')
  const [convertedData, setConvertedData] = useState<ConvertedData>({
    interests: [],
    courses: [],
    exams: []
  })
  const [parseMethod, setParseMethod] = useState<'line-by-line' | 'structured' | 'custom'>('line-by-line')

  const parseLineByLine = (text: string, type: string, level: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const items: any[] = []

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      if (type === 'interests') {
        items.push({
          id: `${trimmedLine.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
          labelKey: `interests.${trimmedLine.toLowerCase().replace(/\s+/g, '')}`,
          descriptionKey: `interests.${trimmedLine.toLowerCase().replace(/\s+/g, '')}Description`,
          level: level,
          subjects: [],
          careerPaths: []
        })
      } else if (type === 'courses') {
        items.push({
          id: `${trimmedLine.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
          name: trimmedLine,
          level: level,
          description: `Comprehensive ${trimmedLine} course`,
          subjects: [],
          duration: '1 year',
          careerPaths: [],
          nextSteps: []
        })
      } else if (type === 'exams') {
        items.push({
          id: `${trimmedLine.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
          name: trimmedLine,
          level: level,
          description: `${trimmedLine} examination`,
          eligibility: 'As per official guidelines',
          applicationWindow: {
            start: '2024-01-01',
            end: '2024-12-31'
          },
          examDate: '2024-06-01',
          subjects: []
        })
      }
    })

    return items
  }

  const parseStructured = (text: string, type: string, level: string) => {
    // Parse structured text like:
    // Name: Value
    // Description: Value
    // Subjects: Value1, Value2, Value3
    const lines = text.split('\n').filter(line => line.trim())
    const items: any[] = []
    let currentItem: any = {}

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      if (trimmedLine.includes(':')) {
        const [key, value] = trimmedLine.split(':').map(s => s.trim())
        
        if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) {
          if (Object.keys(currentItem).length > 0) {
            items.push(currentItem)
          }
          currentItem = {
            id: `${value.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
            level: level
          }
          
          if (type === 'interests') {
            currentItem.labelKey = `interests.${value.toLowerCase().replace(/\s+/g, '')}`
            currentItem.descriptionKey = `interests.${value.toLowerCase().replace(/\s+/g, '')}Description`
            currentItem.subjects = []
            currentItem.careerPaths = []
          } else if (type === 'courses') {
            currentItem.name = value
            currentItem.description = ''
            currentItem.subjects = []
            currentItem.duration = '1 year'
            currentItem.careerPaths = []
            currentItem.nextSteps = []
          } else if (type === 'exams') {
            currentItem.name = value
            currentItem.description = ''
            currentItem.eligibility = 'As per official guidelines'
            currentItem.applicationWindow = { start: '2024-01-01', end: '2024-12-31' }
            currentItem.examDate = '2024-06-01'
            currentItem.subjects = []
          }
        } else if (key.toLowerCase().includes('description')) {
          currentItem.description = value
        } else if (key.toLowerCase().includes('subject')) {
          currentItem.subjects = value.split(',').map(s => s.trim())
        } else if (key.toLowerCase().includes('career') || key.toLowerCase().includes('path')) {
          currentItem.careerPaths = value.split(',').map(s => s.trim())
        } else if (key.toLowerCase().includes('duration')) {
          currentItem.duration = value
        } else if (key.toLowerCase().includes('eligibility')) {
          currentItem.eligibility = value
        } else if (key.toLowerCase().includes('date')) {
          currentItem.examDate = value
        }
      }
    })

    if (Object.keys(currentItem).length > 0) {
      items.push(currentItem)
    }

    return items
  }

  const parseCustom = (text: string, type: string, level: string) => {
    // Custom parsing - user can define their own format
    // This is a template that users can modify
    const lines = text.split('\n').filter(line => line.trim())
    const items: any[] = []

    // Example: Parse format like "Item Name | Description | Subjects"
    lines.forEach((line) => {
      const parts = line.split('|').map(s => s.trim())
      if (parts.length >= 2) {
        const name = parts[0]
        const description = parts[1] || ''
        const subjects = parts[2] ? parts[2].split(',').map(s => s.trim()) : []

        if (type === 'interests') {
          items.push({
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
            labelKey: `interests.${name.toLowerCase().replace(/\s+/g, '')}`,
            descriptionKey: `interests.${name.toLowerCase().replace(/\s+/g, '')}Description`,
            level: level,
            subjects: subjects,
            careerPaths: []
          })
        } else if (type === 'courses') {
          items.push({
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
            name: name,
            level: level,
            description: description,
            subjects: subjects,
            duration: '1 year',
            careerPaths: [],
            nextSteps: []
          })
        } else if (type === 'exams') {
          items.push({
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
            name: name,
            level: level,
            description: description,
            eligibility: 'As per official guidelines',
            applicationWindow: {
              start: '2024-01-01',
              end: '2024-12-31'
            },
            examDate: '2024-06-01',
            subjects: subjects
          })
        }
      }
    })

    return items
  }

  const convertText = () => {
    if (!inputText.trim()) {
      alert('Please enter some text to convert')
      return
    }

    let items: any[] = []

    switch (parseMethod) {
      case 'line-by-line':
        items = parseLineByLine(inputText, dataType, educationLevel)
        break
      case 'structured':
        items = parseStructured(inputText, dataType, educationLevel)
        break
      case 'custom':
        items = parseCustom(inputText, dataType, educationLevel)
        break
    }

    setConvertedData(prev => ({
      ...prev,
      [dataType]: items
    }))

    console.log(`Converted ${dataType}:`, items)
  }

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(convertedData[dataType], null, 2)
    navigator.clipboard.writeText(jsonString)
    alert('JSON copied to clipboard!')
  }

  const downloadJSON = () => {
    const jsonString = JSON.stringify(convertedData[dataType], null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataType}-${educationLevel.toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getExampleText = () => {
    if (dataType === 'interests') {
      return `Science
Mathematics
Technology
Arts
Commerce
Engineering
Medicine
Law`
    } else if (dataType === 'courses') {
      return `Name: Science Foundation Course
Description: Basic science concepts for 10th grade
Subjects: Physics, Chemistry, Biology, Mathematics
Duration: 1 year

Name: Mathematics Advanced
Description: Advanced mathematics for 10th grade
Subjects: Algebra, Geometry, Trigonometry
Duration: 1 year`
    } else if (dataType === 'exams') {
      return `JEE Main | Joint Entrance Examination Main | Physics, Chemistry, Mathematics
NEET | National Eligibility cum Entrance Test | Physics, Chemistry, Biology
GATE | Graduate Aptitude Test in Engineering | Computer Science, Mathematics`
    }
    return ''
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Text Data Converter</h1>
        <p className="text-muted-foreground">Convert your text data into JSON format for NEXT VERSE</p>
      </div>

      <Tabs defaultValue="converter" className="space-y-6">
        <TabsList>
          <TabsTrigger value="converter">Text Converter</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="converter" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data-type">Data Type</Label>
                    <Select value={dataType} onValueChange={(value: any) => setDataType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interests">Interests</SelectItem>
                        <SelectItem value="courses">Courses</SelectItem>
                        <SelectItem value="exams">Exams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="education-level">Education Level</Label>
                    <Select value={educationLevel} onValueChange={setEducationLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">10th Grade</SelectItem>
                        <SelectItem value="12th">12th Grade</SelectItem>
                        <SelectItem value="UG">Undergraduate</SelectItem>
                        <SelectItem value="PG">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="parse-method">Parse Method</Label>
                  <Select value={parseMethod} onValueChange={(value) => setParseMethod(value as 'line-by-line' | 'structured' | 'custom')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line-by-line">Line by Line</SelectItem>
                      <SelectItem value="structured">Structured Text</SelectItem>
                      <SelectItem value="custom">Custom Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="input-text">Your Text Data</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Paste your text data here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={convertText} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Convert to JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setInputText(getExampleText())}
                  >
                    Load Example
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Converted JSON</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {convertedData[dataType].length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-600">
                        {convertedData[dataType].length} items converted
                      </span>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                      <pre className="text-xs">
                        {JSON.stringify(convertedData[dataType], null, 2)}
                      </pre>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy JSON
                      </Button>
                      <Button onClick={downloadJSON} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Convert your text data to see JSON output here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Format Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Line by Line Format</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`Science
Mathematics
Technology
Arts
Commerce`}
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Each line becomes a separate item. Perfect for simple lists.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Structured Format</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`Name: Science Foundation Course
Description: Basic science concepts for 10th grade
Subjects: Physics, Chemistry, Biology, Mathematics
Duration: 1 year

Name: Mathematics Advanced
Description: Advanced mathematics for 10th grade
Subjects: Algebra, Geometry, Trigonometry`}
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use "Name:", "Description:", "Subjects:" format for detailed data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Custom Format (Pipe Separated)</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`JEE Main | Joint Entrance Examination Main | Physics, Chemistry, Mathematics
NEET | National Eligibility cum Entrance Test | Physics, Chemistry, Biology
GATE | Graduate Aptitude Test in Engineering | Computer Science, Mathematics`}
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use "|" to separate fields: Name | Description | Subjects
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Choose Data Type</h3>
                <p className="text-sm text-muted-foreground">
                  Select whether you're adding interests, courses, or exams.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 2: Select Education Level</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the education level (10th, 12th, UG, PG) for your data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 3: Choose Parse Method</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Line by Line:</strong> Each line becomes one item</li>
                  <li>• <strong>Structured:</strong> Use "Name:", "Description:" format</li>
                  <li>• <strong>Custom:</strong> Use "|" to separate fields</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 4: Paste Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Copy and paste your text data into the text area.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 5: Convert and Use</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Convert to JSON" and then copy/download the result. 
                  Paste it into the appropriate JSON file in <code>public/seed/</code> directory.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
