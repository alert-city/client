import {z} from "zod";

export const reviewEventSchema = z.object({
    id: z.string().min(1, "Event ID is required!"),
    isReviewed: z.boolean({message: "Review status is required!"}),
    isApproved: z.boolean({message: "Pass status is required!"}),
    reviewComment: z.string().optional()
});