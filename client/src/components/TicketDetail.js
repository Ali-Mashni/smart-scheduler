// src/components/TicketDetail.js
import React from 'react';
import PrimaryButton from './PrimaryButton';

export default function TicketDetail({ ticket, isMissingInfo, onAction }) {
  return (
    <div>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p>
        <strong>Subject:</strong> {ticket.subject || 'Missing Subject'}
      </p>
      <p>
        <strong>Message:</strong> {ticket.message || 'Missing Message'}
      </p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {isMissingInfo ? (
          <PrimaryButton onClick={() => onAction(ticket.id, 'Dismissed')}>
            Dismiss
          </PrimaryButton>
        ) : (
          <>
            {ticket.status !== 'In Progress' && (
              <PrimaryButton onClick={() => onAction(ticket.id, 'In Progress')}>
                Mark In Progress
              </PrimaryButton>
            )}
            {ticket.status !== 'Resolved' && (
              <PrimaryButton onClick={() => onAction(ticket.id, 'Resolved')}>
                Mark Resolved
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
    </div>
  );
}
