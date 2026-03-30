import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="w-full py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Loved by thousands of users</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Jenkins",
              role: "Freelancer",
              content: "Moneytraits completely changed how I look at my business finances. The AI insights caught subscriptions I forgot I was paying for."
            },
            {
              name: "Michael Chen",
              role: "Software Engineer",
              content: "The dark mode dashboard is beautiful, but the automated reports are what keep me here. Such a clean and fast UX."
            },
            {
              name: "Elena Rodriguez",
              role: "Small Business Owner",
              content: "Finally, a budgeting tool that doesn't feel like a spreadsheet. Financial tracking feels magical and intuitive now."
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4 p-8 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground italic">&quot;{item.content}&quot;</p>
              <div className="mt-auto pt-4 border-t border-border/50">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
