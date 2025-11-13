"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { type Conversation } from "../types";

import { ConversationHistory } from "./conversation-history";

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export function ConversationHistoryModal({ isOpen, onClose, conversation }: ConversationHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historial de: {conversation.nombre}</DialogTitle>
        </DialogHeader>
        <ConversationHistory conversation={conversation} />
      </DialogContent>
    </Dialog>
  );
}
