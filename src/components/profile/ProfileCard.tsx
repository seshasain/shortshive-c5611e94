import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save, X, Camera, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/auth';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  date_of_birth?: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  onUpdate: (updatedProfile: Partial<ProfileData>) => Promise<void>;
}

const ProfileCard = ({ profile, onUpdate }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>(profile);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      await onUpdate({ avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-pixar-blue/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-pixar-blue/20 ring-offset-2 transition-all duration-300 group-hover:ring-pixar-blue/30">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white text-2xl font-semibold">
                  {profile.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-pixar-blue text-white rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Camera className="h-4 w-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2 text-gray-600">
                <span className="h-4 w-4 text-pixar-blue" />
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-pixar-blue/20 focus:border-pixar-blue"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-pixar-blue" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email || ''}
                disabled
                className="bg-gray-50 border-pixar-blue/20"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone_number" className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-pixar-blue" />
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-pixar-blue/20 focus:border-pixar-blue"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-pixar-blue" />
                Country
              </Label>
              <Input
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-pixar-blue/20 focus:border-pixar-blue"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="date_of_birth" className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-pixar-blue" />
                Date of Birth
              </Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-pixar-blue/20 focus:border-pixar-blue"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="border-pixar-blue/20 hover:bg-pixar-blue/5"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 