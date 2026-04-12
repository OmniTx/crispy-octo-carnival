export function productsToCSV(products: any[]): string {
  const headers = ['name', 'price', 'description', 'pack_size']
  const rows = products.map((p) =>
    headers.map((h) => {
      const val = String(p[h] ?? '')
      // Escape double quotes and wrap in quotes if contains comma/newline
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export function parseCSV(text: string): Array<{ name: string; price: number; description: string; pack_size: string }> {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  const nameIdx = headers.indexOf('name')
  const priceIdx = headers.indexOf('price')
  const descIdx = headers.indexOf('description')
  const packIdx = headers.indexOf('pack_size')

  if (nameIdx === -1 || priceIdx === -1) {
    throw new Error('CSV must have "name" and "price" columns')
  }

  const results: Array<{ name: string; price: number; description: string; pack_size: string }> = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    const name = cols[nameIdx]?.trim()
    const price = parseFloat(cols[priceIdx]?.trim())

    if (!name || isNaN(price)) continue

    results.push({
      name,
      price,
      description: descIdx >= 0 ? (cols[descIdx]?.trim() || '') : '',
      pack_size: packIdx >= 0 ? (cols[packIdx]?.trim() || '') : '',
    })
  }

  return results
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  result.push(current)
  return result
}
