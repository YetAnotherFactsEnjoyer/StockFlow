import {
  useState,
  type FormEvent,
} from 'react';
import {
  FiCheck,
  FiCopy,
  FiLink,
  FiMail,
  FiSend,
  FiTrash2,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';

import { Button } from '../../../shared/components/Button';
import { useOnboarding } from '../context/useOnboarding';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FeedbackMessage = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

export default function TeamStep() {
  const { state, dispatch } = useOnboarding();

  const [emailInput, setEmailInput] = useState('');
  const [emailFeedback, setEmailFeedback] =
    useState<FeedbackMessage>(null);
  const [linkFeedback, setLinkFeedback] =
    useState<FeedbackMessage>(null);

  const workspaceIdentifier =
    state.organization.slug.trim() || 'workspace';

  const workspaceName =
    state.branding.applicationName.trim() ||
    state.organization.name.trim() ||
    'StockFlow';

  const inviteLink =
    typeof window === 'undefined'
      ? `/join/${workspaceIdentifier}`
      : `${window.location.origin}/join/${workspaceIdentifier}`;

  const canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function';

  function handleAddMembers(event: FormEvent) {
    event.preventDefault();
    setEmailFeedback(null);

    const enteredEmails = emailInput
      .split(/[\s,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (enteredEmails.length === 0) {
      setEmailFeedback({
        type: 'error',
        message:
          'Enter at least one colleague email address.',
      });
      return;
    }

    const uniqueEmails = [...new Set(enteredEmails)];

    const invalidEmails = uniqueEmails.filter(
      (email) => !EMAIL_PATTERN.test(email),
    );

    if (invalidEmails.length > 0) {
      setEmailFeedback({
        type: 'error',
        message: `Invalid email address: ${invalidEmails[0]}`,
      });
      return;
    }

    const existingEmails = new Set(
      state.teamMembers.map((member) =>
        member.email.toLowerCase(),
      ),
    );

    const newEmails = uniqueEmails.filter(
      (email) => !existingEmails.has(email),
    );

    if (newEmails.length === 0) {
      setEmailFeedback({
        type: 'error',
        message:
          'These colleagues have already been added.',
      });
      return;
    }

    const newMembers = newEmails.map((email) => ({
      temporaryId: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email,
      role: 'employee' as const,
    }));

    dispatch({
      type: 'UPDATE_TEAM_MEMBERS',
      payload: [
        ...state.teamMembers,
        ...newMembers,
      ],
    });

    setEmailInput('');

    const ignoredCount =
      uniqueEmails.length - newEmails.length;

    if (ignoredCount > 0) {
      setEmailFeedback({
        type: 'info',
        message: `${newEmails.length} ${
          newEmails.length === 1
            ? 'colleague was'
            : 'colleagues were'
        } added. ${ignoredCount} duplicate ${
          ignoredCount === 1
            ? 'email was'
            : 'emails were'
        } ignored.`,
      });

      return;
    }

    setEmailFeedback({
      type: 'success',
      message: `${newEmails.length} ${
        newEmails.length === 1
          ? 'colleague was'
          : 'colleagues were'
      } added.`,
    });
  }

  function handleRemoveMember(
    temporaryId: string,
  ) {
    dispatch({
      type: 'UPDATE_TEAM_MEMBERS',
      payload: state.teamMembers.filter(
        (member) =>
          member.temporaryId !== temporaryId,
      ),
    });

    setEmailFeedback(null);
  }

  async function handleCopyLink() {
    setLinkFeedback(null);

    try {
      await navigator.clipboard.writeText(
        inviteLink,
      );

      setLinkFeedback({
        type: 'success',
        message:
          'Invitation link copied to your clipboard.',
      });
    } catch {
      setLinkFeedback({
        type: 'error',
        message:
          'The link could not be copied. Select and copy it manually.',
      });
    }
  }

  async function handleShareLink() {
    setLinkFeedback(null);

    if (!canShare) {
      setLinkFeedback({
        type: 'error',
        message:
          'Sharing is not supported by this browser. Copy the link instead.',
      });
      return;
    }

    try {
      await navigator.share({
        title: `Join ${workspaceName}`,
        text: `You have been invited to join ${workspaceName} on StockFlow.`,
        url: inviteLink,
      });

      setLinkFeedback({
        type: 'success',
        message: 'Invitation shared successfully.',
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      setLinkFeedback({
        type: 'error',
        message:
          'The invitation could not be shared. Copy the link instead.',
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-default">
          Team setup
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Invite your colleagues
        </h1>

        <p className="mt-3 text-base leading-7 text-text-secondary">
          Bring your team into {workspaceName}. Share one
          link or send invitations by email.
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-default text-white">
              <FiLink className="size-5" />
            </span>
            <div>
            <h2 className="text-base font-semibold text-text-primary">
              Invite with a link
            </h2>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Anyone with this link can request to join.
            </p>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-secondary p-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              aria-label="Workspace invitation link"
              onFocus={(event) =>
                event.currentTarget.select()
              }
              className="min-h-10 w-full min-w-0 bg-transparent px-2 font-mono text-sm text-text-primary outline-none"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-surface px-4 text-sm font-semibold text-text-primary transition hover:bg-border-subtle focus:outline-none focus:ring-4 focus:ring-brand-default/10"
              >
                <FiCopy className="size-4" />
                Copy link
              </button>

              {canShare && (
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-default px-4 text-sm font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-4 focus:ring-brand-default/20"
                >
                  <FiSend className="size-4" />
                  Share link
                </button>
              )}
            </div>
          </div>

          <Feedback
            feedback={linkFeedback}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
          <div className="flex items-center justify-between bg-text-primary px-5 py-4 text-surface sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-text-primary">
                <FiMail className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold">
                  Invite by email
                </h2>
                <p className="mt-0.5 text-xs opacity-70">
                  Add multiple teammates in one go
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary sm:block">
              Quick invite
            </span>
          </div>

          <form onSubmit={handleAddMembers} className="p-5 sm:p-6">
            <label
              htmlFor="team-email-input"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
              Email addresses
            </label>

            <div className="mt-2 flex min-h-14 items-center rounded-xl border border-border-subtle bg-surface-secondary px-4 transition focus-within:border-brand-default focus-within:ring-4 focus-within:ring-brand-default/10">
              <FiMail className="mr-3 size-4 shrink-0 text-text-secondary" />
              <input
                id="team-email-input"
                type="text"
                value={emailInput}
                onChange={(event) => {
                  setEmailInput(event.target.value);

                  if (emailFeedback) {
                    setEmailFeedback(null);
                  }
                }}
                placeholder="alex@company.com, sam@company.com"
                className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/65"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-xs leading-5 text-text-secondary">
                Separate addresses with commas or spaces.
              </p>

              <Button type="submit" className="shrink-0">
                <FiUserPlus className="size-4" />
                Add to team
              </Button>
            </div>

            <Feedback feedback={emailFeedback} />
          </form>
        </section>

        <section className="rounded-2xl border border-border-subtle bg-surface shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-text-primary">
                <FiUsers className="size-5" />
              </span>
              <div>
            <h2 className="text-base font-semibold text-text-primary">
              Pending invitations
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {state.teamMembers.length}{' '}
              {state.teamMembers.length === 1
                ? 'colleague added'
                : 'colleagues added'}
            </p>
              </div>
            </div>
            {state.teamMembers.length > 0 && (
              <span className="rounded-full bg-brand-default px-3 py-1 text-xs font-bold text-white">
                {state.teamMembers.length}
              </span>
            )}
          </div>

          {state.teamMembers.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-surface-secondary text-text-secondary">
                <FiUsers className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium text-text-primary">Your team list is empty</p>
              <p className="mt-1 text-sm text-text-secondary">You can skip this step and invite people later.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle px-5 sm:px-6">
              {state.teamMembers.map(
                (member) => (
                  <li
                    key={member.temporaryId}
                    className={[
                      'flex items-center justify-between gap-5 py-4',
                    ].join(' ')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-default text-sm font-bold uppercase text-white">
                        {member.email.charAt(0)}
                      </span>
                      <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {member.email}
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        Employee access
                      </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember(
                          member.temporaryId,
                        )
                      }
                      aria-label={`Remove ${member.email}`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-secondary hover:text-danger focus:outline-none focus:ring-4 focus:ring-danger/10"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Feedback({
  feedback,
}: {
  feedback: FeedbackMessage;
}) {
  return (
    <p
      aria-live="polite"
      className={[
        'mt-3 flex min-h-5 items-center gap-1.5 text-sm',
        feedback?.type === 'error'
          ? 'text-danger'
          : feedback?.type === 'success'
            ? 'text-success'
            : 'text-text-secondary',
      ].join(' ')}
    >
      {feedback?.type === 'success' && <FiCheck className="size-4 shrink-0" />}
      {feedback?.message}
    </p>
  );
}
