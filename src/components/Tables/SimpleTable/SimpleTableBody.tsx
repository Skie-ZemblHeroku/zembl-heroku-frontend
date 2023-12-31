import { formatData } from '../../../helpers/formatter'
import TableCell from '../Parts/TableCell'
import { TableBodyProps } from '../types'

const SimpleTableBody = ({ data, columns }: TableBodyProps) => {
  const computedData = data.map((record, index) => {
    const ob = record as Record<string, unknown>
    if (!ob) return null
    const computedColumns = columns.map((col) => {
      const value = formatData(ob[col.key], col.type, {
        dateFormat: col.dateFormat,
        numberFormatOptions: col.numberFormatOptions,
      })

      return (
        <TableCell key={`${index}_${col.key}`} className={col.bodyClassName ?? ''}>
          {value}
        </TableCell>
      )
    })

    const rowKey = (ob.id as string) ?? index
    return <tr key={rowKey}>{computedColumns}</tr>
  })
  return <tbody>{computedData}</tbody>
}

export default SimpleTableBody
