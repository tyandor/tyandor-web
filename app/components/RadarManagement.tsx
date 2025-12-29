'use client';

import { useState } from 'react';
import { Technology, TechnologyHistory } from '@/app/radar/page';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface RadarManagementProps {
  technologies: Technology[];
  history: TechnologyHistory[];
  onDataChange: () => void;
}

const emptyTechnology: Omit<Technology, 'id'> = {
  name: '',
  description: '',
  quadrant: 'Techniques',
  ring: 'Assess',
  tags: [],
  source_url: '',
};

export default function RadarManagement({ technologies, history, onDataChange }: RadarManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<Partial<Technology> | null>(null);

  const openDialog = (tech?: Technology) => {
    setSelectedTech(tech || emptyTechnology);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/radar/technologies/${id}`, { method: 'DELETE' });
    onDataChange();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const body = {
      ...data,
      tags: (data.tags as string).split(',').map(t => t.trim()).filter(Boolean),
    };

    const url = selectedTech?.id ? `/api/radar/technologies/${selectedTech.id}` : '/api/radar/technologies';
    const method = selectedTech?.id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsOpen(false);
    setSelectedTech(null);
    onDataChange();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openDialog()}>Add Technology</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quadrant</TableHead>
              <TableHead>Ring</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technologies.map((tech) => (
              <TableRow key={tech.id}>
                <TableCell className="font-medium">{tech.name}</TableCell>
                <TableCell>{tech.quadrant}</TableCell>
                <TableCell>{tech.ring}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog(tech)}>Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-rosePine-surface">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the technology entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tech.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">History</h2>
      <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Technology</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {history.map(h => {
                    const techName = technologies.find(t => t.id === h.technology_id)?.name || 'N/A';
                    return (
                        <TableRow key={h.id}>
                            <TableCell>{techName}</TableCell>
                            <TableCell>{h.change_description}</TableCell>
                            <TableCell>{h.changed_by}</TableCell>
                            <TableCell>{new Date(h.changed_at).toLocaleString()}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-rosePine-surface">
          <DialogHeader>
            <DialogTitle>{selectedTech?.id ? 'Edit' : 'Add'} Technology</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={selectedTech?.name} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={selectedTech?.description} />
            </div>
            <div>
              <Label htmlFor="quadrant">Quadrant</Label>
              <Select name="quadrant" defaultValue={selectedTech?.quadrant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a quadrant" />
                </SelectTrigger>
                <SelectContent className="bg-rosePine-surface">
                  <SelectItem value="Techniques">Techniques</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Platforms">Platforms</SelectItem>
                  <SelectItem value="Languages & Frameworks">Languages & Frameworks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ring">Ring</Label>
              <Select name="ring" defaultValue={selectedTech?.ring}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a ring" />
                </SelectTrigger>
                <SelectContent className="bg-rosePine-surface">
                  <SelectItem value="Adopt">Adopt</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Assess">Assess</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" defaultValue={selectedTech?.tags?.join(', ')} />
            </div>
            <div>
              <Label htmlFor="source_url">Source URL</Label>
              <Input id="source_url" name="source_url" defaultValue={selectedTech?.source_url} />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
