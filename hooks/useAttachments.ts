import { useState, useEffect, useMemo } from 'react';
import {
  getAllAttachments,
  getAttachmentsByType,
  getAttachmentById,
  getAttachmentTypes,
  getMagazineSizes,
} from '../lib/dataService';
import type { Attachment } from '../lib/types';

// Hook for getting all attachments
export function useAllAttachments() {
  const attachments = useMemo(() => getAllAttachments(), []);
  return attachments;
}

// Hook for getting attachments by type
export function useAttachmentsByType(type: string | null) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      setAttachments(getAllAttachments());
      return;
    }

    setIsLoading(true);
    const typeAttachments = getAttachmentsByType(type);
    setAttachments(typeAttachments.sort((a, b) => a.tier - b.tier));
    setIsLoading(false);
  }, [type]);

  return { attachments, isLoading };
}

// Hook for getting a single attachment
export function useAttachmentDetails(attachmentId: string | null) {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!attachmentId) {
      setAttachment(null);
      return;
    }

    setIsLoading(true);
    const foundAttachment = getAttachmentById(attachmentId);
    setAttachment(foundAttachment || null);
    setIsLoading(false);
  }, [attachmentId]);

  return { attachment, isLoading };
}

// Hook for getting attachment type list with display labels
export function useAttachmentTypesList() {
  const typeLabels: Record<string, string> = {
    grip: 'Grip',
    stock: 'Stock',
    barrel: 'Barrel',
    magazine: 'Magazine',
    muzzle: 'Muzzle',
    optic: 'Optic',
  };

  const types = useMemo(() => {
    const typeIds = getAttachmentTypes();
    return typeIds.map(id => ({
      id,
      label: typeLabels[id] || id,
    }));
  }, []);

  return types;
}

// Hook for magazine sizes
export function useMagazineSizes() {
  const magazineSizes = useMemo(() => getMagazineSizes(), []);
  return magazineSizes;
}
