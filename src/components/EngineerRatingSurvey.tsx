
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EngineerRatingSurveyProps {
  engineerId: string;
  engineerName: string;
  siteId: string;
  siteName: string;
  onClose: () => void;
}

const EngineerRatingSurvey: React.FC<EngineerRatingSurveyProps> = ({
  engineerId,
  engineerName,
  siteId,
  siteName,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert the rating into the engineer_ratings table
      const { error } = await supabase.from("engineer_ratings").insert({
        engineer_id: engineerId,
        site_id: siteId,
        rating,
        feedback,
        site_name: siteName,
      });

      if (error) throw error;

      // Update the engineer's average rating and total reviews in engineer_profiles
      const { data: engineerData, error: engineerError } = await supabase
        .from("engineer_profiles")
        .select("average_rating, total_reviews")
        .eq("id", engineerId)
        .single();

      if (engineerError) {
        console.error("Error fetching engineer profile:", engineerError);
      } else if (engineerData) {
        const currentTotalReviews = engineerData.total_reviews || 0;
        const currentAvgRating = engineerData.average_rating || 0;
        
        // Calculate new average rating
        const newTotalReviews = currentTotalReviews + 1;
        const newAvgRating = 
          ((currentAvgRating * currentTotalReviews) + rating) / newTotalReviews;
          
        // Update the engineer profile
        const { error: updateError } = await supabase
          .from("engineer_profiles")
          .update({
            average_rating: newAvgRating,
            total_reviews: newTotalReviews
          })
          .eq("id", engineerId);
          
        if (updateError) {
          console.error("Error updating engineer profile:", updateError);
        }
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your rating has been submitted successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
      <CardHeader>
        <CardTitle className="text-akhanya">Rate Engineer Performance</CardTitle>
        <CardDescription>
          Please rate {engineerName}'s work at {siteName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-1 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-colors"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="pt-2">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Feedback (Optional)
          </label>
          <textarea
            id="feedback"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-akhanya focus:border-akhanya"
            placeholder="Please share any additional feedback about the engineer's performance..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EngineerRatingSurvey;
