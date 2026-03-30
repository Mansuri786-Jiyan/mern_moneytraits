import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Ready to take control of your finances?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Join thousands of users who are already building stronger financial habits. Sign up today and experience the difference.
        </p>
        <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all" asChild>
          <Link to="/sign-up">
            Get Started for Free
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
