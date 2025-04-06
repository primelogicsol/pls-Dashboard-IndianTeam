"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Plus, Mail, Users, Search, ChevronDown, ChevronUp, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Assuming we have a newsletters array from an API or database
const newsletters = [
  {
    id: "1",
    subject: "Welcome to Our Platform",
    content: "<h1>Hello there!</h1><p><strong>Welcome to our platform!</strong></p>",
    sentAt: "2024-02-08T10:00:00Z",
    recipientType: "all",
    recipientCount: 1000,
  },
  {
    id: "2",
    subject: "Special Offer for You",
    content: "<h1>Exclusive Offer</h1><p><strong>Check out our latest features</strong></p>",
    sentAt: "2024-02-07T15:30:00Z",
    recipientType: "clients",
    recipientCount: 500,
  },
  {
    id: "3",
    subject: "New Feature Announcement",
    content: "<h1>Exciting News!</h1><p>We've just launched a game-changing feature.</p>",
    sentAt: "2024-02-06T09:00:00Z",
    recipientType: "freelancers",
    recipientCount: 750,
  },
  {
    id: "4",
    subject: "Monthly Newsletter - February",
    content: "<h1>February Highlights</h1><p>Here's what happened this month on our platform.</p>",
    sentAt: "2024-02-05T11:00:00Z",
    recipientType: "all",
    recipientCount: 2000,
  },
  {
    id: "5",
    subject: "Important Platform Update",
    content: "<h1>Platform Update</h1><p>We're improving our services. Here's what you need to know.</p>",
    sentAt: "2024-02-04T14:15:00Z",
    recipientType: "all",
    recipientCount: 1800,
  },
]

export default function NewsletterPage() {
  const [allNewsletters, setAllNewsletters] = useState(newsletters)
  const [recentNewsletters, setRecentNewsletters] = useState<typeof newsletters>([])
  const [olderNewsletters, setOlderNewsletters] = useState<typeof newsletters>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedNewsletter, setSelectedNewsletter] = useState<(typeof newsletters)[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch newsletters from an API here
    // For now, we'll use the static data

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const recent = allNewsletters.filter((newsletter) => new Date(newsletter.sentAt) >= oneWeekAgo)
    const older = allNewsletters.filter((newsletter) => new Date(newsletter.sentAt) < oneWeekAgo)
    setRecentNewsletters(recent)
    setOlderNewsletters(older)
  }, [allNewsletters])

  const filteredNewsletters = olderNewsletters.filter((newsletter) => {
    const matchesSearch = newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = dateFilter
      ? format(new Date(newsletter.sentAt), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")
      : true
    return matchesSearch && matchesDate
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredNewsletters.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleEdit = (newsletter: (typeof newsletters)[0]) => {
    setSelectedNewsletter(newsletter)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (newsletter: (typeof newsletters)[0]) => {
    setSelectedNewsletter(newsletter)
    setIsDeleteDialogOpen(true)
  }

  const handleView = (newsletter: (typeof newsletters)[0]) => {
    setSelectedNewsletter(newsletter)
    setIsViewDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedNewsletter) {
      // In a real application, you would call an API to delete the newsletter
      setAllNewsletters(allNewsletters.filter((n) => n.id !== selectedNewsletter.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Newsletters</h1>
        <Button asChild>
          <Link href="/dashboard/moderator/newsletter/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Newsletter
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search newsletters"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-[300px]"
          />
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <div className="relative">
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
              {isCalendarOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
            </Button>
          </div>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={(date) => {
                setDateFilter(date)
                setCurrentPage(1)
                setIsCalendarOpen(false)
              }}
              initialFocus
              components={{
                IconLeft: () => <ChevronDown className="h-4 w-4" />,
                IconRight: () => <ChevronUp className="h-4 w-4" />,
              }}
            />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button
            variant="ghost"
            onClick={() => {
              setDateFilter(undefined)
              setCurrentPage(1)
            }}
          >
            Clear Date Filter
          </Button>
        )}
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Recent Newsletters</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recentNewsletters.map((newsletter, index) => (
          <motion.div
            key={newsletter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="text-lg">{newsletter.subject}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-primary" />
                    Sent to: {newsletter.recipientType}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    Sent on: {format(new Date(newsletter.sentAt), "PPP")}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Recipients: {newsletter.recipientCount}
                  </div>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {newsletter.content.replace(/<[^>]*>/g, "")}
                </p>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleView(newsletter)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(newsletter)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(newsletter)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Older Newsletters</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Sent To</TableHead>
            <TableHead>Sent On</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((newsletter) => (
            <TableRow key={newsletter.id}>
              <TableCell>{newsletter.subject}</TableCell>
              <TableCell>{newsletter.recipientType}</TableCell>
              <TableCell>{format(new Date(newsletter.sentAt), "PPP")}</TableCell>
              <TableCell>{newsletter.recipientCount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(newsletter)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(newsletter)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(newsletter)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredNewsletters.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedNewsletter?.subject}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              <strong>Sent to:</strong> {selectedNewsletter?.recipientType}
            </p>
            <p>
              <strong>Sent on:</strong> {selectedNewsletter && format(new Date(selectedNewsletter.sentAt), "PPP")}
            </p>
            <p>
              <strong>Recipients:</strong> {selectedNewsletter?.recipientCount}
            </p>
            <div className="mt-4 border p-4 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: selectedNewsletter?.content || "" }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Newsletter</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" defaultValue={selectedNewsletter?.subject} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientType" className="text-right">
                Recipient Type
              </Label>
              <Select defaultValue={selectedNewsletter?.recipientType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="clients">Clients</SelectItem>
                  <SelectItem value="freelancers">Freelancers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea id="content" defaultValue={selectedNewsletter?.content} className="col-span-3" rows={10} />
            </div>
          </div>
          <Button type="submit">Save Changes</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the newsletter "{selectedNewsletter?.subject}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

