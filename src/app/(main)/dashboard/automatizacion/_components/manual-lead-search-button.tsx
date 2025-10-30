"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { InstagramScrapingDialog } from "./instagram-scraping-dialog";

export function InstagramScrapingButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick} className="w-fit px-6 shadow-lg shadow-blue-500/50 transition-all duration-300">
        <Search className="mr-2 h-4 w-4" />
        Instagram Scraping
      </Button>
      <InstagramScrapingDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
