import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import { ReactNode, useCallback, useState } from 'react'

const AccordionCard = ({ open, alwaysOpen, title, children }: AccordionCardProps) => {
  const [_open, setOpen] = useState<boolean>(open)

  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const titleDisplay = title ? (
    <AccordionHeader
      className={`py-3 px-6 bg-zembl-s rounded-t-lg ${alwaysOpen ? 'pointer-events-none' : ''}`}
      onClick={handleOpen}
    >
      {title}
    </AccordionHeader>
  ) : null

  return (
    <Accordion open={_open} className="border border-blue-gray-100 rounded-lg">
      {titleDisplay}
      <AccordionBody className="p-6 flex">{children}</AccordionBody>
    </Accordion>
  )
}

interface AccordionCardProps {
  open: boolean
  alwaysOpen?: boolean
  title?: ReactNode
  children: ReactNode
}

export default AccordionCard