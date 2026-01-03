import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import type { ClientData } from './types';
import { ClientRow } from './ClientRow';

interface ClientTableProps {
  data: ClientData[];
  page: number;
  totalPages: number;
  onPageChange: (event: unknown, value: number) => void;
}

export function ClientTable({ data, page, totalPages, onPageChange }: ClientTableProps) {
  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        className="rounded-lg"
        sx={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid',
          borderColor: 'var(--border-default)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: 'var(--bg-table-header)',
              }}
            >
              <TableCell sx={{ width: '40px', py: 1.5 }} />
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Segurado
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Telefone
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Tipo de Seguro
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Apólice
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Vencimento
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Seguradora
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Corretor
                </span>
              </TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Status Vencimento
                </span>
              </TableCell>
              <TableCell align="center" sx={{ py: 1.5 }}>
                <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  Ações
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <ClientRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              fontSize: '0.875rem',
            },
            '& .Mui-selected': {
              backgroundColor: '#2563eb',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
          }}
        />
      </div>
    </>
  );
}
