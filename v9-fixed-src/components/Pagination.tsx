import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export default function Pagination({
  basePath,
  currentPage,
  totalPages
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav className="pagination" aria-label="Navigasi halaman">
      <div>
        {currentPage > 1 ? (
          <Link href={pageHref(basePath, previousPage)} rel="prev">
            Sebelumnya
          </Link>
        ) : (
          <span aria-disabled="true">Sebelumnya</span>
        )}

        <strong>
          Halaman {currentPage} dari {totalPages}
        </strong>

        {currentPage < totalPages ? (
          <Link href={pageHref(basePath, nextPage)} rel="next">
            Berikutnya
          </Link>
        ) : (
          <span aria-disabled="true">Berikutnya</span>
        )}
      </div>

      <div className="paginationEdges">
        {currentPage > 2 && (
          <Link href={basePath}>Halaman pertama</Link>
        )}

        {currentPage < totalPages - 1 && (
          <Link href={pageHref(basePath, totalPages)}>
            Halaman terakhir
          </Link>
        )}
      </div>
    </nav>
  );
}
