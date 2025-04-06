import { Star, Clock, Building2, Globe2, Database, Cloud } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Freelancer } from "@/data/freelancers"

interface FreelancerCardProps {
  freelancer: Freelancer
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
            <AvatarFallback>{freelancer.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{freelancer.name}</h3>
              <button className="text-muted-foreground hover:text-foreground">•••</button>
            </div>
            <p className="text-sm text-muted-foreground">{freelancer.role}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{freelancer.rating}</span>
              <span className="text-sm text-muted-foreground">({freelancer.reviews} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Available in {freelancer.availability.weeks} week{freelancer.availability.weeks > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Industries Served</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {freelancer.industries.map((industry) => (
                  <Badge key={industry} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Frontend</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {freelancer.technologies.frontend.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-primary/10">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Backend & Database</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...freelancer.technologies.backend, ...freelancer.technologies.database].map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-primary/10">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Cloud & DevOps</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {freelancer.technologies.cloud.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-primary/10">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Certifications</span>
              <div className="text-sm text-muted-foreground">{freelancer.certifications.join(", ")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

