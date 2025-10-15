'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { Button } from '@heroui/button';
interface ModalButtonProps {
  buttonText: string;
  buttonClassName?: string;
  modal: {
    title: string;
    body: string;
    icon?: string;
    buttons?: {
      text: string;
      color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
      onClick?: () => void;
    }[];
  };
}

export default function ModalButton({ buttonText, buttonClassName, modal }: ModalButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const buttons = modal.buttons || [
    {
      text: 'Entendido',
      color: 'primary' as const,
    },
  ];

  return (
    <>
      <Button
        onPress={onOpen}
        className={buttonClassName || "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"}
        size="lg"
      >
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modal.icon && <span className="text-2xl">{modal.icon}</span>}
                {modal.title}
              </ModalHeader>
              <ModalBody>
                <p>{modal.body}</p>
              </ModalBody>
              <ModalFooter>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    color={button.color || 'primary'}
                    onPress={() => {
                      if (button.onClick) {
                        button.onClick();
                      }
                      onClose();
                    }}
                  >
                    {button.text}
                  </Button>
                ))}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}