"use client";

import { Sparkles, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCredexCtaVariant } from "@/lib/credex-cta-variant";

interface CredexCtaProps {
  monthlySavings: number;
  savingsTier: string;
  className?: string;
}

export function CredexCta({ monthlySavings, savingsTier, className = "" }: CredexCtaProps) {
  const variant = getCredexCtaVariant(monthlySavings, savingsTier);

  if (variant === "prominent") {
    return (
      <Card className={`print:hidden border-white/10 bg-primary p-8 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 mb-8 rounded-3xl ${className}`.trim()}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
          <Sparkles size={28} className="text-[#0FF395] shrink-0" />
          <div>
            <h3 className="text-xl font-extrabold text-white mb-2">You have material savings on the table</h3>
            <p className="text-sm text-primary-foreground/70 max-w-[520px] leading-relaxed">
              At about ${monthlySavings.toLocaleString()}/mo in identified savings, Credex can help you buy the same AI plans through verified credit transfers — often{" "}
              <strong className="text-white">10–30% below retail</strong>.
            </p>
          </div>
        </div>
        <Button size="lg" asChild className="rounded-full shrink-0 bg-[#0FF395] text-[#112F34] hover:bg-[#0AD87D]">
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
            Explore Credex marketplace
            <ArrowRight size={18} className="ml-2" />
          </a>
        </Button>
      </Card>
    );
  }

  if (variant === "soft") {
    return (
      <Card className={`print:hidden border-white/10 bg-primary p-8 text-primary-foreground flex flex-col items-center md:items-start gap-5 mb-8 rounded-3xl ${className}`.trim()}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
          <Sparkles size={24} className="text-[#0FF395] shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5">Your AI spend looks healthy</h3>
            <p className="text-sm text-primary-foreground/70 max-w-[560px] leading-relaxed">
              We did not find large plan-level wins — nice work keeping the stack lean. When you scale or add tools, Credex lists discounted credits so you can avoid paying list price.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <Button variant="outline" size="lg" asChild className="rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              <Mail size={18} className="mr-2" />
              Get Credex updates
            </a>
          </Button>
          <Button variant="ghost" className="rounded-full text-white hover:bg-white/10" asChild>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              Browse marketplace
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`print:hidden border-white/10 bg-primary p-8 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 mb-8 rounded-3xl ${className}`.trim()}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
        <Sparkles size={24} className="text-[#0FF395] shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-white mb-1.5">Save more with Credex credits</h3>
          <p className="text-sm text-primary-foreground/70 max-w-[500px] leading-relaxed">
            Credex matches teams with verified AI and cloud credits at below retail — same vendors and plans, lower burn.
          </p>
        </div>
      </div>
      <Button size="lg" asChild className="rounded-full shrink-0 bg-[#0FF395] text-[#112F34] hover:bg-[#0AD87D]">
        <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
          Explore Credex
          <ArrowRight size={16} className="ml-2" />
        </a>
      </Button>
    </Card>
  );
}
