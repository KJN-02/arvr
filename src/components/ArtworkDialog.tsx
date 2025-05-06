
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { artworks } from '../data/artworks';

interface ArtworkDialogProps {
  artwork: typeof artworks[0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ArtworkDialog: React.FC<ArtworkDialogProps> = ({ 
  artwork, 
  open, 
  onOpenChange 
}) => {
  if (!artwork) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{artwork.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Artwork Image */}
          <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
            <img 
              src={artwork.image} 
              alt={artwork.title}
              className="object-cover w-full h-full"
              style={{ backgroundColor: artwork.color }} // Fallback color
            />
          </div>
          
          {/* Artwork Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold">Artist</h3>
              <p>{artwork.artist}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Year</h3>
              <p>{artwork.year}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Medium</h3>
              <p>{artwork.medium}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkDialog;
