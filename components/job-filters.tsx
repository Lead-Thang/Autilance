"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Filter, X } from "lucide-react"

interface JobFiltersProps {
  onFilterChange: (filters: any) => void
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState({
    // Search
    search: "",
    
    // Client Quality and Reliability
    verifiedPayment: false,
    spendTier: "",
    minHireRate: 0,
    minRating: 0,
    disputeRate: 0,
    rehireRate: 0,
    
    // Budget and Scope Reality
    budgetType: "",
    budgetRealism: "",
    hourlyRate: "",
    premiumWillingness: false,
    scopeClarity: "",
    
    // Decision Speed and Process
    maxTimeToHire: 0,
    maxProposals: 0,
    conversionRate: 0,
    
    // Fit and Skills Alignment
    requiredSkills: [] as string[],
    industry: "",
    techStack: "",
    projectType: "",
    
    // Risk and Red Flags
    revisionLimit: false,
    scopeCreepHistory: false,
    unpaidTest: false,
    extremeNDA: false,
    
    // Communication and Culture
    tools: [] as string[],
    language: "",
    
    // Operational Details
    projectSize: "",
    timelineFlexibility: "",
    
    // Competition and Opportunity
    maxInvites: 0,
    experienceLevel: "",
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      ...filters,
      search: "",
      verifiedPayment: false,
      spendTier: "",
      minHireRate: 0,
      minRating: 0,
      disputeRate: 0,
      rehireRate: 0,
      budgetType: "",
      budgetRealism: "",
      hourlyRate: "",
      premiumWillingness: false,
      scopeClarity: "",
      maxTimeToHire: 0,
      maxProposals: 0,
      conversionRate: 0,
      requiredSkills: [],
      industry: "",
      techStack: "",
      projectType: "",
      revisionLimit: false,
      scopeCreepHistory: false,
      unpaidTest: false,
      extremeNDA: false,
      tools: [],
      language: "",
      projectSize: "",
      timelineFlexibility: "",
      maxInvites: 0,
      experienceLevel: "",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const presetFilters = [
    {
      name: "Fast, fair, likely to hire",
      filters: {
        verifiedPayment: true,
        spendTier: "5-50k",
        minHireRate: 30,
        maxTimeToHire: 5,
        maxProposals: 15,
        budgetRealism: "within-market",
      }
    },
    {
      name: "High-value retainers",
      filters: {
        budgetType: "hourly",
        hourlyRate: "40-120",
        rehireRate: 20,
        projectType: "maintenance",
      }
    },
    {
      name: "Low-risk new clients",
      filters: {
        verifiedPayment: true,
        scopeClarity: "detailed",
        maxProposals: 10,
        projectType: "trial-milestone",
      }
    }
  ]

  const applyPreset = (preset: any) => {
    const newFilters = { ...filters, ...preset.filters }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-4">
      {/* Applied Filters Display */}
      <div className="flex flex-wrap gap-2">
        {filters.jobType && (
          <Badge variant="secondary">
            {filters.jobType === "full-time" ? "Full-Time" :
             filters.jobType === "freelance" ? "Freelance" :
             filters.jobType === "contract" ? "Contract" : "Part-Time"}
          </Badge>
        )}
        {filters.isRemote !== undefined && (
          <Badge variant="secondary">
            {filters.isRemote ? "Remote Only" : "On-site"}
          </Badge>
        )}
        {filters.verifiedPayment && (
          <Badge variant="secondary">Verified Payment</Badge>
        )}
        {filters.spendTier && (
          <Badge variant="secondary">Spend: {filters.spendTier}</Badge>
        )}
        {filters.minHireRate > 0 && (
          <Badge variant="secondary">Hire Rate: {filters.minHireRate}%+</Badge>
        )}
        {filters.minRating > 0 && (
          <Badge variant="secondary">Rating: {filters.minRating}+</Badge>
        )}
        {filters.budgetType && (
          <Badge variant="secondary">Budget: {filters.budgetType}</Badge>
        )}
        {filters.hourlyRate && (
          <Badge variant="secondary">Rate: {filters.hourlyRate}</Badge>
        )}
        {filters.premiumWillingness && (
          <Badge variant="secondary">Premium Willing</Badge>
        )}
        {filters.industry && (
          <Badge variant="secondary">Industry: {filters.industry}</Badge>
        )}
        {filters.projectType && (
          <Badge variant="secondary">Project: {filters.projectType}</Badge>
        )}
        {filters.unpaidTest && (
          <Badge variant="destructive">Unpaid Test</Badge>
        )}
        {filters.scopeCreepHistory && (
          <Badge variant="destructive">Scope Creep</Badge>
        )}
        {filters.extremeNDA && (
          <Badge variant="destructive">Extreme NDA</Badge>
        )}
      </div>
    </div>
  )
}

export function FilterButton({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    // Search
    search: "",

    // Job Type & Classification
    jobType: "", // 'full-time', 'freelance', 'contract', 'part-time'
    isRemote: undefined as boolean | undefined,

    // Client Quality and Reliability
    verifiedPayment: false,
    spendTier: "",
    minHireRate: 0,
    minRating: 0,
    disputeRate: 0,
    rehireRate: 0,

    // Budget and Scope Reality
    budgetType: "",
    budgetRealism: "",
    hourlyRate: "",
    premiumWillingness: false,
    scopeClarity: "",

    // Decision Speed and Process
    maxTimeToHire: 0,
    maxProposals: 0,
    conversionRate: 0,

    // Fit and Skills Alignment
    requiredSkills: [] as string[],
    industry: "",
    techStack: "",
    projectType: "",

    // Risk and Red Flags
    revisionLimit: false,
    scopeCreepHistory: false,
    unpaidTest: false,
    extremeNDA: false,

    // Communication and Culture
    tools: [] as string[],
    language: "",

    // Operational Details
    projectSize: "",
    timelineFlexibility: "",

    // Competition and Opportunity
    maxInvites: 0,
    experienceLevel: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      ...filters,
      search: "",
      verifiedPayment: false,
      spendTier: "",
      minHireRate: 0,
      minRating: 0,
      disputeRate: 0,
      rehireRate: 0,
      budgetType: "",
      budgetRealism: "",
      hourlyRate: "",
      premiumWillingness: false,
      scopeClarity: "",
      maxTimeToHire: 0,
      maxProposals: 0,
      conversionRate: 0,
      requiredSkills: [],
      industry: "",
      techStack: "",
      projectType: "",
      revisionLimit: false,
      scopeCreepHistory: false,
      unpaidTest: false,
      extremeNDA: false,
      tools: [],
      language: "",
      projectSize: "",
      timelineFlexibility: "",
      maxInvites: 0,
      experienceLevel: "",
    }
    setFilters(clearedFilters)
    if (onFilterChange) {
      onFilterChange(clearedFilters)
    }
  }

  const presetFilters = [
    {
      name: "Fast, fair, likely to hire",
      filters: {
        verifiedPayment: true,
        spendTier: "5-50k",
        minHireRate: 30,
        maxTimeToHire: 5,
        maxProposals: 15,
        budgetRealism: "within-market",
      }
    },
    {
      name: "High-value retainers",
      filters: {
        budgetType: "hourly",
        hourlyRate: "40-120",
        rehireRate: 20,
        projectType: "maintenance",
      }
    },
    {
      name: "Low-risk new clients",
      filters: {
        verifiedPayment: true,
        scopeClarity: "detailed",
        maxProposals: 10,
        projectType: "trial-milestone",
      }
    }
  ]

  const applyPreset = (preset: any) => {
    const newFilters = { ...filters, ...preset.filters }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search jobs, companies, skills..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Job Type & Classification */}
          <div className="space-y-2">
            <Label>Job Type</Label>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="jobType">Employment Type</Label>
                <Select value={filters.jobType} onValueChange={(value) => handleFilterChange("jobType", value)}>
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="isRemote">Work Location</Label>
                <Select
                  value={filters.isRemote === undefined ? "" : filters.isRemote.toString()}
                  onValueChange={(value) => handleFilterChange("isRemote", value === "" ? undefined : value === "true")}
                >
                  <SelectTrigger id="isRemote">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="true">Remote Only</SelectItem>
                    <SelectItem value="false">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preset Filters */}
          <div className="space-y-2">
            <Label>Preset Filters</Label>
            <div className="space-y-2">
              {presetFilters.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Client Quality and Reliability */}
          <div className="space-y-2">
            <Label>Client Quality</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verifiedPayment"
                  checked={filters.verifiedPayment}
                  onCheckedChange={(checked) => handleFilterChange("verifiedPayment", checked)}
                />
                <Label htmlFor="verifiedPayment">Verified Payment Method</Label>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="spendTier">Total Spend</Label>
                <Select value={filters.spendTier} onValueChange={(value) => handleFilterChange("spendTier", value)}>
                  <SelectTrigger id="spendTier">
                    <SelectValue placeholder="Any spend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No spend</SelectItem>
                    <SelectItem value="1-5k">1k - 5k</SelectItem>
                    <SelectItem value="5-50k">5k - 50k</SelectItem>
                    <SelectItem value="50k+">50k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label>Hire Rate: {filters.minHireRate}%+</Label>
                <Slider
                  value={[filters.minHireRate]}
                  onValueChange={([value]) => handleFilterChange("minHireRate", value)}
                  max={100}
                  step={5}
                />
              </div>
              
              <div className="space-y-1">
                <Label>Min Rating: {filters.minRating}+</Label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={([value]) => handleFilterChange("minRating", value)}
                  max={5}
                  step={0.5}
                />
              </div>
            </div>
          </div>
          
          {/* Budget and Scope */}
          <div className="space-y-2">
            <Label>Budget & Scope</Label>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="budgetType">Budget Type</Label>
                <Select value={filters.budgetType} onValueChange={(value) => handleFilterChange("budgetType", value)}>
                  <SelectTrigger id="budgetType">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Select value={filters.hourlyRate} onValueChange={(value) => handleFilterChange("hourlyRate", value)}>
                  <SelectTrigger id="hourlyRate">
                    <SelectValue placeholder="Any rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20-40">$20 - $40</SelectItem>
                    <SelectItem value="40-80">$40 - $80</SelectItem>
                    <SelectItem value="80-150">$80 - $150</SelectItem>
                    <SelectItem value="150+">$150+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="premiumWillingness"
                  checked={filters.premiumWillingness}
                  onCheckedChange={(checked) => handleFilterChange("premiumWillingness", checked)}
                />
                <Label htmlFor="premiumWillingness">Willing to Pay Premium</Label>
              </div>
            </div>
          </div>
          
          {/* Skills and Fit */}
          <div className="space-y-2">
            <Label>Skills & Fit</Label>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="industry">Industry</Label>
                <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Any industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="healthtech">Healthtech</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="projectType">Project Type</Label>
                <Select value={filters.projectType} onValueChange={(value) => handleFilterChange("projectType", value)}>
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-build">New Build</SelectItem>
                    <SelectItem value="refactor">Refactor</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="research">Research/Prototype</SelectItem>
                    <SelectItem value="trial-milestone">Trial Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Risk Factors */}
          <div className="space-y-2">
            <Label>Risk Factors</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unpaidTest"
                  checked={filters.unpaidTest}
                  onCheckedChange={(checked) => handleFilterChange("unpaidTest", checked)}
                />
                <Label htmlFor="unpaidTest">Unpaid Test Task</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scopeCreepHistory"
                  checked={filters.scopeCreepHistory}
                  onCheckedChange={(checked) => handleFilterChange("scopeCreepHistory", checked)}
                />
                <Label htmlFor="scopeCreepHistory">History of Scope Creep</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extremeNDA"
                  checked={filters.extremeNDA}
                  onCheckedChange={(checked) => handleFilterChange("extremeNDA", checked)}
                />
                <Label htmlFor="extremeNDA">Extreme NDA/IP Clauses</Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
