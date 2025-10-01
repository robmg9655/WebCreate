import fs from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const file = path.join(process.cwd(), 'generated', id, 'site.json');
  if (!fs.existsSync(file)) return <div>Not found</div>;
  // redirect to the standalone raw preview which renders a fresh HTML page
  return redirect(`/api/preview/raw/${id}`);
}
