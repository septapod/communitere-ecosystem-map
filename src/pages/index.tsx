'use client';

import { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { OrganizationList } from '@/components/OrganizationList';
import { MapView } from '@/components/MapView';
import { getOrganizations, getCategories } from '@/lib/supabase';
import { Organization } from '@/types';

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(new Set([]));
  const [selectedScope, setSelectedScope] = useState<Set<string>>(new Set([]));
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | number>('list');

  const scopes = ['Local', 'Regional', 'State', 'National', 'International', 'Continental'];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const orgs = await getOrganizations();
        const cats = await getCategories();
        setOrganizations(orgs);
        setFilteredOrganizations(orgs);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter organizations based on search, category, and scope
  useEffect(() => {
    let filtered = organizations;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.organization.toLowerCase().includes(query) ||
          org.description.toLowerCase().includes(query) ||
          org.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory.size > 0) {
      filtered = filtered.filter((org) => selectedCategory.has(org.category));
    }

    // Scope filter
    if (selectedScope.size > 0) {
      filtered = filtered.filter((org) => selectedScope.has(org.scope));
    }

    setFilteredOrganizations(filtered);
  }, [searchQuery, selectedCategory, selectedScope, organizations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <Navbar isBordered className="bg-white shadow-md">
        <NavbarBrand className="mr-4">
          <div className="text-2xl font-bold text-indigo-600">Communitere</div>
          <div className="ml-2 text-sm text-gray-600">Ecosystem Map</div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              className="text-gray-600"
              variant="light"
              as="button"
            >
              ℹ️
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Community Organization Ecosystem
          </h1>
          <p className="text-gray-600">
            Discover and explore the network of mutual aid and community organizations
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white shadow-lg">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <Input
                isClearable
                className="w-full"
                placeholder="Search organizations..."
                startContent={<SearchIcon />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />

              {/* Category Filter */}
              <Select
                label="Category"
                placeholder="All Categories"
                selectedKeys={selectedCategory}
                onSelectionChange={(keys) => {
                  // Handle NextUI's SharedSelection type
                  if (keys === 'all') {
                    // User selected all categories
                    setSelectedCategory(new Set(categories));
                  } else {
                    // Convert Selection (Set<Key>) to Set<string>
                    setSelectedCategory(new Set(Array.from(keys).map(String)));
                  }
                }}
                className="w-full"
              >
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </Select>

              {/* Scope Filter */}
              <Select
                label="Scope"
                placeholder="All Scopes"
                selectedKeys={selectedScope}
                onSelectionChange={(keys) => {
                  // Handle NextUI's SharedSelection type
                  if (keys === 'all') {
                    // User selected all scopes
                    setSelectedScope(new Set(scopes));
                  } else {
                    // Convert Selection (Set<Key>) to Set<string>
                    setSelectedScope(new Set(Array.from(keys).map(String)));
                  }
                }}
                className="w-full"
              >
                {scopes.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Tabs for List and Map Views */}
        <Tabs
          aria-label="View options"
          activeKey={activeTab}
          onSelectionChange={setActiveTab}
          classNames={{
            tabList: 'gap-6 w-full rounded-lg bg-white p-4 shadow-md',
            cursor: 'w-full bg-indigo-600',
            tab: 'max-w-md h-12 text-lg',
            tabContent: 'group-data-[selected=true]:text-indigo-600',
          }}
        >
          {/* List View Tab */}
          <Tab key="list" title="📋 List View" className="w-full">
            <div className="mt-6">
              {isLoading ? (
                <Card className="bg-white shadow-md">
                  <CardBody className="p-12 text-center">
                    <p className="text-gray-600">Loading organizations...</p>
                  </CardBody>
                </Card>
              ) : (
                <OrganizationList
                  organizations={filteredOrganizations}
                  totalCount={filteredOrganizations.length}
                />
              )}
            </div>
          </Tab>

          {/* Map View Tab */}
          <Tab key="map" title="🗺️ Map View" className="w-full">
            <div className="mt-6 h-96 rounded-lg overflow-hidden shadow-md">
              {isLoading ? (
                <Card className="h-full">
                  <CardBody className="flex items-center justify-center h-full">
                    <p className="text-gray-600">Loading map...</p>
                  </CardBody>
                </Card>
              ) : (
                <MapView organizations={filteredOrganizations} />
              )}
            </div>
          </Tab>
        </Tabs>

        {/* Results Summary */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Showing {filteredOrganizations.length} of {organizations.length} organizations
          </p>
        </div>
      </div>
    </div>
  );
}
