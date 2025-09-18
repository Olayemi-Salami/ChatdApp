"use client"

import { useState, useRef, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/hooks/useWallet"
import { useContract } from "@/hooks/useContract"
import { useIPFS } from "@/hooks/useIPFS"
import { Upload, User, Globe, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { 
  RegistrationProps, 
  RegistrationFormData, 
  RegistrationStep, 
  RegistrationState 
} from "@/types/registration"

export function Registration({ onBack, onSuccess }: RegistrationProps) {
  const { address } = useWallet()
  const { registerENS, isENSAvailable, isLoading: contractLoading } = useContract()
  const { uploadToIPFS, isUploading, uploadError } = useIPFS()

  const [formData, setFormData] = useState<RegistrationFormData>({
    ensName: "",
    displayName: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [ensAvailable, setEnsAvailable] = useState<boolean | null>(null)
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>("form")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const checkENSAvailability = async (ensName: string) => {
    if (!ensName || ensName.length < 3) {
      setEnsAvailable(null)
      return
    }

    setIsCheckingAvailability(true)
    try {
      const available = await isENSAvailable(ensName)
      setEnsAvailable(available)
    } catch (error) {
      console.error("Failed to check ENS availability:", error)
      setEnsAvailable(null)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleENSNameChange = (value: string) => {
    // Only allow alphanumeric characters and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setFormData((prev) => ({ ...prev, ensName: sanitized }))
    setEnsAvailable(null)

    // Debounce availability check
    const timeoutId = setTimeout(() => {
      checkENSAvailability(sanitized)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!profileImage) {
      toast({
        title: "Profile image required",
        description: "Please select a profile image",
        variant: "destructive",
      })
      return
    }

    if (!ensAvailable) {
      toast({
        title: "ENS name not available",
        description: "Please choose a different ENS name",
        variant: "destructive",
      })
      return
    }

    try {
      // Step 1: Upload image to IPFS
      setRegistrationStep("uploading")
      const imageHash = await uploadToIPFS(profileImage)

      // Step 2: Register ENS
      setRegistrationStep("registering")
      await registerENS(formData.ensName, formData.displayName, imageHash)

      // Step 3: Success
      setRegistrationStep("success")
      toast({
        title: "Registration successful!",
        description: `Your ENS name ${formData.ensName}.premium has been registered`,
      })

      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
      setRegistrationStep("form")
    }
  }

  const isFormValid = formData.ensName.length >= 3 && formData.displayName.length >= 2 && profileImage && ensAvailable

  if (registrationStep === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Registration Complete!</h2>
              <p className="text-muted-foreground">
                Welcome to Premium Chat! Your ENS name{" "}
                <span className="font-semibold text-primary">{formData.ensName}.premium</span> has been successfully
                registered.
              </p>
              <div className="pt-4">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-4 border-primary">
                  {imagePreview && (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 font-medium text-foreground">{formData.displayName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (registrationStep === "uploading" || registrationStep === "registering") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">
                {registrationStep === "uploading" ? "Uploading to IPFS..." : "Registering ENS..."}
              </h2>
              <p className="text-muted-foreground">
                {registrationStep === "uploading"
                  ? "Uploading your profile image to the decentralized network"
                  : "Registering your ENS name on the blockchain"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Register Your .premium Name</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Create Your Identity</CardTitle>
            <CardDescription>
              Register your unique .premium name and set up your profile to start chatting with the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="profile-image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profileImage ? "Change Image" : "Upload Image"}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                  maxLength={50}
                />
                <p className="text-sm text-muted-foreground">This is how others will see your name</p>
              </div>

              {/* ENS Name */}
              <div className="space-y-2">
                <Label htmlFor="ens-name">ENS Name</Label>
                <div className="flex">
                  <Input
                    id="ens-name"
                    placeholder="yourname"
                    value={formData.ensName}
                    onChange={(e) => handleENSNameChange(e.target.value)}
                    className="rounded-r-none"
                    maxLength={30}
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-muted-foreground">
                    .premium
                  </div>
                </div>

                {/* ENS Availability Status */}
                {formData.ensName.length >= 3 && (
                  <div className="flex items-center gap-2">
                    {isCheckingAvailability ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Checking availability...</span>
                      </>
                    ) : ensAvailable === true ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">{formData.ensName}.premium is available!</span>
                      </>
                    ) : ensAvailable === false ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">{formData.ensName}.premium is already taken</span>
                      </>
                    ) : null}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Choose a unique name (3-30 characters, letters, numbers, and hyphens only)
                </p>
              </div>

              {/* Connected Wallet Info */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Connected Wallet</p>
                    <p className="text-xs text-muted-foreground">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!isFormValid || contractLoading || isUploading}
              >
                {contractLoading || isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isUploading ? "Uploading..." : "Registering..."}
                  </>
                ) : (
                  "Register ENS Name"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}