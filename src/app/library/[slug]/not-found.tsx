import { NotFoundView } from "@/components/shell/NotFoundView";

export default function EntryNotFound() {
  return <NotFoundView title="No such entry" message="There is no entry at this address. It may have been renamed or removed." />;
}
