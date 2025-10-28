import { ProfileHeader } from "../ProfileHeader";

export default function ProfileHeaderExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-4xl">
        <ProfileHeader
          username="creator_example"
          nickname="Creative Creator"
          followers={1250000}
          likes={45000000}
          videos={342}
          timestamp="2 minutes ago"
          onExport={() => console.log("Export triggered")}
          onShare={() => console.log("Share triggered")}
        />
      </div>
    </div>
  );
}
