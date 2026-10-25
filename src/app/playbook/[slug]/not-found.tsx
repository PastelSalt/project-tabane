import { NotFoundView } from "@/components/shell/NotFoundView";

export default function PlaybookNotFound() {
  return <NotFoundView title="No such playbook" message="There is no playbook at this address. It may have been renamed or removed." />;
}
