// src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import StatsCard from "../ui/StatsCard";
import { getCurrentUser } from "../services/auth";
import { fetchMe, saveProfile } from "../services/profile";

export default function ProfilePage() {
  const cached = useMemo(() => getCurrentUser(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState<string>(cached?.firstName ?? "");
  const [lastName, setLastName] = useState<string>(cached?.lastName ?? "");
  const [email, setEmail] = useState<string>(cached?.email ?? "");
  const [bio, setBio] = useState<string>(cached?.bio ?? "");
  const [profilePicture, setProfilePicture] = useState<string>(cached?.profilePicture ?? "");

  const displayName =
    (firstName || lastName)
      ? `${firstName} ${lastName}`.trim()
      : (email ? email.split("@")[0] : "user");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const me = await fetchMe();
        if (!mounted) return;

        setFirstName(me.firstName ?? "");
        setLastName(me.lastName ?? "");
        setEmail(me.email ?? "");
        setBio(me.bio ?? "");
        setProfilePicture(me.profilePicture ?? "");
      } catch (e: any) {
        console.error(e);
        alert(e?.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      await saveProfile({ firstName, lastName, bio, profilePicture });
      alert("Profile updated successfully");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Profile Settings" subtitle="Manage your account information" />

      <Card className="rounded-3xl border border-purple-100 shadow-sm p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <Avatar name={displayName} size="lg" />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border border-purple-200 text-lg">
              📷
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-purple-700">{displayName}</h3>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm text-gray-600">First Name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              className="bg-purple-50/40 border-purple-200"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Last Name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              className="bg-purple-50/40 border-purple-200"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Name</label>
            <Input value={displayName} disabled className="bg-purple-50/40 border-purple-200" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <Input value={email} disabled className="bg-purple-50/40 border-purple-200" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Bio</label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              disabled={loading}
              className="bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Bio is saved locally for now (backend chưa support field này).
            </p>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Profile Picture URL</label>
            <Input
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="https://..."
              disabled={loading}
              className="bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <Button
              onClick={onSave}
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-purple-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard label="Tasks Created" value={0} color="purple" />
          <StatsCard label="Tasks Completed" value={0} color="green" />
          <StatsCard label="Tasks Shared" value={0} color="blue" />
        </div>
      </Card>
    </div>
  );
}