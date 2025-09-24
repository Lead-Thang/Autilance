import { createUploadthing, type FileRouter } from "uploadthing/next"
import { createClient } from "@/lib/supabase/server"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const supabase = createClient()
      
      // Get the session from the request
      const { data: { session }, error } = await supabase.auth.getSession()
      
      // If you throw, the user will not be able to upload
      if (!session || error) throw new UploadThingError("Unauthorized")
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      // Return the uploaded file URL
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter