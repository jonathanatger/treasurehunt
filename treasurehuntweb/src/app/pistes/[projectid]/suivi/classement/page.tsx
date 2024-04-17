import {
  TableBody,
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";

export default async function Page({
  params,
}: {
  params: { projectid: string };
}) {
  return (
    <>
      <Table className="grow overflow-auto">
        <TableCaption>
          L'avancement des participants sera mis à jour ici lors de la partie.
        </TableCaption>
        <TableHeader className="outline outline-1 outline-muted">
          <TableRow>
            <TableHead className="w-[100px]">Classement</TableHead>
            <TableHead>Equipe</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="w-[300px] text-center">
              Dernier Objectif atteint
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          <TableRow></TableRow>
        </TableBody>
      </Table>
    </>
  );
}
