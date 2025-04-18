import React from 'react';
import PrimaryButton from './PrimaryButton';

export default function TicketDetail({ ticket, isMissingInfo, onAction, hideActions = false }) {
  return (
    <div>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p><strong>Subject:</strong> {ticket.subject || 'Missing Subject'}</p>
      <p><strong>Message:</strong> {ticket.message || 'Missing Message'}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      {ticket.adminNote && (
  <div className="mt-4 border p-3 rounded bg-gray-800 text-sm">
    <p className="font-semibold mb-1">Admin Note:</p>
    <p>{ticket.adminNote}</p>
  </div>
)}
      {!hideActions && (
        <div className="mt-4 flex flex-wrap gap-4">
          {isMissingInfo ? (
            <PrimaryButton onClick={() => onAction(ticket.id, 'Dismissed')}>
              Dismiss
            </PrimaryButton>
          ) : (
            <>
              {ticket.status !== 'In Progress' && (
                <PrimaryButton onClick={() => onAction(ticket.id, 'In Progress')}>
                  In Progress
                </PrimaryButton>
              )}
              {ticket.status !== 'Resolved' && (
                <PrimaryButton onClick={() => onAction(ticket.id, 'Resolved')}>
                  Resolved
                </PrimaryButton>
              )}
              {ticket.status !== 'Escalated' && (
                <PrimaryButton onClick={() => onAction(ticket.id, 'Escalated')}>
                  Escalate
                </PrimaryButton>
              )}
           

            </>
          )}
        </div>
      )}
    </div>
  );
}