import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportResult {
  success: boolean
  message: string
  data?: any[]
  errors?: string[]
}

export default function BulkDataImporter() {
  const [importText, setImportText] = useState('')
  const [dataType, setDataType] = useState<'interests' | 'courses' | 'exams'>('interests')
  const [educationLevel, setEducationLevel] = useState('10th')
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const parseTextData = (text: string, type: string, level: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const items: any[] = []
    const errors: any[] = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      try {
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
      } catch (error) {
        errors.push(`Line ${index + 1}: ${error}`)
      }
    })

    return { items, errors }
  }

  const importData = async () => {
    if (!importText.trim()) {
      setImportResult({
        success: false,
        message: 'Please enter some text to import',
        errors: ['No input text provided']
      })
      return
    }

    setIsImporting(true)

    try {
      const { items, errors } = parseTextData(importText, dataType, educationLevel)
      
      if (errors.length > 0) {
        setImportResult({
          success: false,
          message: `Import completed with ${errors.length} errors`,
          data: items,
          errors: errors
        })
      } else {
        setImportResult({
          success: true,
          message: `Successfully imported ${items.length} items`,
          data: items
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadJSON = () => {
    if (!importResult?.data) return

    const jsonString = JSON.stringify(importResult.data, null, 2)
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

  const copyToClipboard = () => {
    if (!importResult?.data) return

    const jsonString = JSON.stringify(importResult.data, null, 2)
    navigator.clipboard.writeText(jsonString)
    alert('JSON copied to clipboard!')
  }

  const getExampleData = () => {
    if (dataType === 'interests') {
      return `Science
Mathematics
Technology
Arts
Commerce
Engineering
Medicine
Law
Business
Research`
    } else if (dataType === 'courses') {
      return `Science Foundation Course
Mathematics Advanced
Computer Programming
Digital Marketing
Business Management
Data Science
Artificial Intelligence
Machine Learning
Web Development
Mobile App Development`
    } else if (dataType === 'exams') {
      return `JEE Main
JEE Advanced
NEET
GATE
CAT
UPSC
SSC
Banking Exams
Railway Exams
Defense Exams`
    }
    return ''
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Bulk Data Importer</h1>
        <p className="text-muted-foreground">Import your text data in bulk and convert to JSON format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Settings</CardTitle>
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
              <Label htmlFor="import-text">Your Text Data (One item per line)</Label>
              <Textarea
                id="import-text"
                placeholder="Enter your data here, one item per line..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={importData} 
                disabled={isImporting}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setImportText(getExampleData())}
              >
                Load Example
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {importResult ? (
              <>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  importResult.success 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{importResult.message}</span>
                </div>

                {importResult.data && importResult.data.length > 0 && (
                  <>
                    <div className="bg-gray-100 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                      <pre className="text-xs">
                        {JSON.stringify(importResult.data, null, 2)}
                      </pre>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                        Copy JSON
                      </Button>
                      <Button onClick={downloadJSON} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </>
                )}

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Errors:</h4>
                    <div className="space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Import your data to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-1">Paste Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Copy and paste your text data, one item per line
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-1">Import & Convert</h3>
              <p className="text-sm text-muted-foreground">
                Click import to convert your data to JSON format
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-1">Download & Use</h3>
              <p className="text-sm text-muted-foreground">
                Download the JSON file and add it to your app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
