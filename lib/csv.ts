const CSV_HEADERS = [
  'name',
  'price',
  'description',
  'pack_size',
  'name_bn',
  'description_bn',
  'usage_info',
  'usage_info_bn',
] as const

export type CSVProductRow = {
  name: string
  price: number
  description: string
  pack_size: string
  name_bn: string | null
  description_bn: string | null
  usage_info: string | null
  usage_info_bn: string | null
}

function emptyToNull(s: string | undefined): string | null {
  const t = s?.trim()
  return t ? t : null
}

export function productsToCSV(products: Record<string, unknown>[]): string {
  const headers = [...CSV_HEADERS]
  const rows = products.map((p) =>
    headers.map((h) => {
      const val = String(p[h] ?? '')
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export function parseCSV(text: string): CSVProductRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  const nameIdx = headers.indexOf('name')
  const priceIdx = headers.indexOf('price')
  const descIdx = headers.indexOf('description')
  const packIdx = headers.indexOf('pack_size')
  const nameBnIdx = headers.indexOf('name_bn')
  const descBnIdx = headers.indexOf('description_bn')
  const usageIdx = headers.indexOf('usage_info')
  const usageBnIdx = headers.indexOf('usage_info_bn')

  if (nameIdx === -1 || priceIdx === -1) {
    throw new Error('CSV must have "name" and "price" columns')
  }

  const results: CSVProductRow[] = []

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
      name_bn: nameBnIdx >= 0 ? emptyToNull(cols[nameBnIdx]) : null,
      description_bn: descBnIdx >= 0 ? emptyToNull(cols[descBnIdx]) : null,
      usage_info: usageIdx >= 0 ? emptyToNull(cols[usageIdx]) : null,
      usage_info_bn: usageBnIdx >= 0 ? emptyToNull(cols[usageBnIdx]) : null,
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
