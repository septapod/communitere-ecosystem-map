'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
  Chip,
} from '@nextui-org/react';
import { Organization } from '@/types';

interface OrganizationListProps {
  organizations: Organization[];
  totalCount: number;
}

export function OrganizationList({ organizations, totalCount }: OrganizationListProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (org: Organization) => {
    setSelectedOrg(org);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrg(null);
  };

  if (organizations.length === 0) {
    return (
      <Card className="bg-white shadow-md">
        <CardBody className="p-12 text-center">
          <p className="text-gray-600 text-lg">No organizations found matching your filters.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card
            key={org.id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            isPressable
            onPress={() => openModal(org)}
          >
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-indigo-600">{org.organization}</p>
                <p className="text-sm text-gray-500">{org.type}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                  <p className="text-sm text-gray-800">{org.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Category</p>
                  <Chip size="sm" variant="flat" color="primary" className="mt-1">
                    {org.category}
                  </Chip>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Scope</p>
                  <Chip size="sm" variant="flat" color="secondary" className="mt-1">
                    {org.scope}
                  </Chip>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Description</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{org.description}</p>
                </div>
              </div>
            </CardBody>
            <Divider />
            <CardBody className="py-3">
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onPress={() => openModal(org)}
              >
                View Details
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <h2 className="text-2xl font-bold">{selectedOrg?.organization}</h2>
                <p className="text-sm text-indigo-100">{selectedOrg?.type}</p>
              </ModalHeader>
              <ModalBody className="py-6">
                {selectedOrg && (
                  <div className="space-y-6">
                    {/* Category and Scope */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Category
                        </p>
                        <Chip size="sm" variant="flat" color="primary">
                          {selectedOrg.category}
                        </Chip>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Scope</p>
                        <Chip size="sm" variant="flat" color="secondary">
                          {selectedOrg.scope}
                        </Chip>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                        Location
                      </p>
                      <p className="text-gray-800">{selectedOrg.location}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                        Description
                      </p>
                      <p className="text-gray-700 leading-relaxed">{selectedOrg.description}</p>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                        Services & Activities
                      </p>
                      <p className="text-gray-700 leading-relaxed">{selectedOrg.services}</p>
                    </div>

                    {/* Contact */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Contact</p>
                      <p className="text-gray-700 break-all">{selectedOrg.contact}</p>
                    </div>

                    {/* Website */}
                    {selectedOrg.website && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Website
                        </p>
                        <Link
                          href={`https://${selectedOrg.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          {selectedOrg.website}
                        </Link>
                      </div>
                    )}

                    {/* Founded */}
                    {selectedOrg.founded && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Founded
                        </p>
                        <p className="text-gray-700">{selectedOrg.founded}</p>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
                {selectedOrg?.website && (
                  <Button
                    as={Link}
                    href={`https://${selectedOrg.website}`}
                    target="_blank"
                    color="primary"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Visit Website
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
