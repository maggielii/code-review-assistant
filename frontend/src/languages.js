export const LANGUAGES = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'csharp', label: 'C#' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
    { id: 'php', label: 'PHP' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'swift', label: 'Swift' },
    { id: 'kotlin', label: 'Kotlin' },
    { id: 'sql', label: 'SQL' },
  ]
  
  export function getLanguageLabel(id) {
    const found = LANGUAGES.find((language) => language.id === id)
    return found ? found.label : id
  }