import React from 'react';
import { History, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { DataTable, Column } from './DataTable';
import { AuditLogEntry } from '../../types';
import { StatusBadge } from './StatusBadge';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const { activeOrgAuditLogs, activeOrg } = useApp();

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (log) => <span className="font-mono text-[11px] text-slate-500">{log.timestamp}</span>,
    },
    {
      key: 'userName',
      header: 'Actor / User',
      render: (log) => (
        <div>
          <div className="font-semibold text-slate-900">{log.userName}</div>
          <div className="text-[10px] text-slate-400 capitalize">{log.userRole.replace('_', ' ')}</div>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      render: (log) => <StatusBadge status={log.module} size="sm" />,
    },
    {
      key: 'action',
      header: 'Action / Event',
      render: (log) => (
        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          {log.action}
        </span>
      ),
    },
    {
      key: 'recordId',
      header: 'Target Record',
      render: (log) => (
        <div className="text-xs">
          <span className="font-medium text-slate-700">{log.recordType}:</span>{' '}
          <span className="text-slate-500 font-mono text-[11px]">{log.recordId}</span>
        </div>
      ),
    },
    {
      key: 'changes',
      header: 'Value Transition (Diff)',
      render: (log) => {
        if (!log.previousValue && !log.newValue) return <span className="text-slate-400">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            {log.previousValue && (
              <span className="line-through text-slate-400 text-[11px] truncate max-w-[120px]">
                {log.previousValue}
              </span>
            )}
            {log.previousValue && log.newValue && (
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            )}
            {log.newValue && (
              <span className="text-emerald-700 font-medium text-[11px] truncate max-w-[140px]">
                {log.newValue}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Audit & Compliance Log (Simulated)"
      subtitle={`Tenant Isolation Audit Trail for ${activeOrg.name}`}
      maxWidth="4xl"
    >
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Every administrative mutation (module assignment toggles, salary modifications, employee promotions, geofence adjustments) automatically writes a simulated audit trail record in memory.
          </span>
        </div>

        <DataTable
          data={activeOrgAuditLogs}
          columns={columns}
          searchPlaceholder="Filter audit trail by action, user, or record ID..."
          filename={`Audit_Log_${activeOrg.code}`}
          pageSize={8}
        />
      </div>
    </Modal>
  );
};
