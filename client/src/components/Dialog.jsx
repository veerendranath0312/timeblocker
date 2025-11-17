'use client';

import { AnimatePresence, motion } from 'motion/react';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePreventScroll } from '../hooks/usePreventScroll';

const DialogContext = createContext(null);

const defaultVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

const defaultTransition = {
  ease: 'easeOut',
  duration: 0.2,
};

function Dialog({
  children,
  variants = defaultVariants,
  transition = defaultTransition,
  defaultOpen,
  onOpenChange,
  open,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen || false
  );

  const dialogRef = useRef(null);

  const isOpen = open !== undefined ? open : uncontrolledOpen;

  // prevent scroll when dialog is open on iOS
  usePreventScroll({
    isDisabled: !isOpen,
  });

  const setIsOpen = React.useCallback(
    (value) => {
      setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleCancel = (e) => {
      e.preventDefault();
      if (isOpen) {
        setIsOpen(false);
      }
    };

    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      document.body.classList.remove('overflow-hidden');
    };
  }, [dialogRef, isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  const handleTrigger = () => {
    setIsOpen(true);
  };

  const onAnimationComplete = (definition) => {
    if (definition === 'exit' && !isOpen) {
      dialogRef.current?.close();
    }
  };

  const baseId = useId();
  const ids = {
    dialog: `motion-ui-dialog-${baseId}`,
    title: `motion-ui-dialog-title-${baseId}`,
    description: `motion-ui-dialog-description-${baseId}`,
  };

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        dialogRef,
        variants,
        transition,
        ids,
        onAnimationComplete,
        handleTrigger,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, className }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  return (
    <button
      onClick={context.handleTrigger}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'transition-colors focus-visible:ring-2 focus-visible:outline-hidden',
        'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

function DialogPortal({
  children,
  container = typeof window !== 'undefined' ? document.body : null,
}) {
  const [mounted, setMounted] = React.useState(false);
  const [portalContainer, setPortalContainer] = React.useState(null);

  useEffect(() => {
    setMounted(true);
    setPortalContainer(container || document.body);

    return () => setMounted(false);
  }, [container]);

  if (!mounted || !portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
}

function DialogContent({ children, className, container }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  const {
    isOpen,
    setIsOpen,
    dialogRef,
    variants,
    transition,
    ids,
    onAnimationComplete,
  } = context;

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.dialog
          key={ids.dialog}
          ref={dialogRef}
          id={ids.dialog}
          aria-labelledby={ids.title}
          aria-describedby={ids.description}
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === dialogRef.current) {
              setIsOpen(false);
            }
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          onAnimationComplete={onAnimationComplete}
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-zinc-200 p-0 shadow-lg',
            'backdrop:bg-black/50 backdrop:backdrop-blur-xs',
            'open:flex open:flex-col',
            className
          )}
        >
          <div className="w-full">{children}</div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );

  return <DialogPortal container={container}>{content}</DialogPortal>;
}

function DialogHeader({ children, className }) {
  return (
    <div className={cn('flex flex-col space-y-1.5', className)}>{children}</div>
  );
}

function DialogTitle({ children, className }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTitle must be used within Dialog');

  return (
    <h2
      id={context.ids.title}
      className={cn('text-base font-medium', className)}
    >
      {children}
    </h2>
  );
}

function DialogDescription({ children, className }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogDescription must be used within Dialog');

  return (
    <p
      id={context.ids.description}
      className={cn('text-base text-zinc-500', className)}
    >
      {children}
    </p>
  );
}

function DialogClose({ className, children, disabled }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogClose must be used within Dialog');

  return (
    <button
      onClick={() => context.setIsOpen(false)}
      type="button"
      aria-label="Close dialog"
      className={cn(
        'absolute top-4 right-4 rounded-xs opacity-70 transition-opacity',
        'hover:opacity-100 focus:ring-2 focus:outline-hidden',
        'focus:ring-zinc-500 focus:ring-offset-2 disabled:pointer-events-none',
        className
      )}
      disabled={disabled}
    >
      {children || <X className="h-4 w-4 cursor-pointer" />}
      <span className="sr-only">Close</span>
    </button>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogContext,
};
