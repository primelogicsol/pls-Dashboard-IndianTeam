export interface FreelancersData {
    success: boolean
    status: number
    message: string
    data: Data[]
    requestInfo: RequestInfo
  }
  
  export interface Data {
    id: string
    userId: any
    whoYouAreId: string
    coreRoleId: string
    eliteSkillCardsId: string
    toolstackProficiencyId: string
    domainExperienceId: string
    industryExperienceId: string
    availabilityWorkflowId: string
    softSkillsId: string
    certificationsId: string
    projectQuotingId: string
    legalAgreementsId: string
    isAccepted: boolean
    createdAt: string
    trashedBy: any
    trashedAt: any
    whoYouAre: WhoYouAre
    coreRole: CoreRole
    eliteSkillCards: EliteSkillCards
    toolstackProficiency: ToolstackProficiency
    domainExperience: DomainExperience
    industryExperience: IndustryExperience
    availabilityWorkflow: AvailabilityWorkflow
    softSkills: SoftSkills
    certifications: Certifications
    projectQuoting: ProjectQuoting
    legalAgreements: LegalAgreements
  }
  
  export interface WhoYouAre {
    id: string
    fullName: string
    email: string
    timeZone: string
    country: string
    professionalLinks: ProfessionalLinks
    phone: any
  }
  
  export interface ProfessionalLinks {}
  
  export interface CoreRole {
    id: string
    primaryDomain: string
  }
  
  export interface EliteSkillCards {
    id: string
    selectedSkills: any[]
  }
  
  export interface ToolstackProficiency {
    id: string
    selectedTools: any[]
  }
  
  export interface DomainExperience {
    id: string
    roles: any[]
  }
  
  export interface IndustryExperience {
    id: string
    selectedIndustries: any[]
  }
  
  export interface AvailabilityWorkflow {
    id: string
    weeklyCommitment: number
    workingHours: any[]
    collaborationTools: any[]
    teamStyle: string
    screenSharing: string
    availabilityExceptions: string
  }
  
  export interface SoftSkills {
    id: string
    collaborationStyle: string
    communicationFrequency: string
    conflictResolution: string
    languages: string[]
    teamVsSolo: string
  }
  
  export interface Certifications {
    id: string
    certificates: any[]
  }
  
  export interface ProjectQuoting {
    id: string
    compensationPreference: string
    smallProjectPrice: number
    midProjectPrice: number
    longTermPrice: number
    milestoneTerms: string
    willSubmitProposals: string
  }
  
  export interface LegalAgreements {
    id: string
    agreements: any[]
    identityVerificationId: string
    workAuthorizationId: string
  }
  
  export interface RequestInfo {
    url: string
    ip: string
    method: string
  }
  