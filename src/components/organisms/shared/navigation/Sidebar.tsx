'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { siteConfig } from '@/app/siteConfig';
import { NAVIGATION_ITEMS } from '@/lib/constants/sidebar-navigation';
import { UserRole } from '@/lib/routes/types';
import { useAuthStore } from '@/store/auth';


import { CreditDisplay } from '@/components/atom/CreditDisplay';
import GradientCtaButton from '@/components/molecules/common/GradientCtaButton';
import { Card, CardContent as UICardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { useUiModalsStore } from '@/store/ui/modals';
import { RiVipCrownLine } from '@remixicon/react';
import { ChevronRightIcon, ChevronsUpDownIcon } from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const openCreditPurchase = useUiModalsStore(state => state.openCreditPurchase);
  const handleOpenPurchase = useCallback(() => openCreditPurchase(), [openCreditPurchase]);
  const userPlan = useAuthStore(state => state.user?.plan);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const { user } = useAuthStore();
  const userRole = user?.role;

  const isActive = (itemUrl?: string) => {
    if (!itemUrl) return false;
    // Exact match for home route to avoid highlighting when on sub-routes
    if (itemUrl === siteConfig.baseLinks.home) {
      return pathname === itemUrl;
    }
    // For other routes, check if pathname matches or starts with the url
    return pathname === itemUrl || pathname.startsWith(itemUrl);
  };

  const currentTheme = resolvedTheme || theme;
  const logoSrc = currentTheme === 'dark' ? '/logos/light-logo.png' : '/logos/dark-logo.png';

  const teams = [
    {
      name: "Acme Inc",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      plan: "Free",
    },
  ];

  const [activeTeam, setActiveTeam] = useState(teams[0]);

  return (
    <ShadcnSidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground data-[size='lg']:group-data-[collapsible=icon]:p-0!"
                >
                  <Image
                    src={logoSrc}
                    alt="KostraLogo"
                    width={32}
                    height={32}
                    className="size-8 shrink-0"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeTeam.plan}
                    </span>
                  </div>
                  <ChevronsUpDownIcon />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Teams</DropdownMenuLabel>
                  {teams.map((team) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                    >
                      {team.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {NAVIGATION_ITEMS.map((section) => {
          // Filter items by user role
          const filteredItems = section.items.filter((item) => {
            if (!item.roles || item.roles.length === 0) return true;
            return userRole && item.roles.includes(userRole as UserRole);
          });

          // Don't render section if no items after filtering
          if (filteredItems.length === 0) return null;

          // Don't render Admin section if user is not ADMIN
          if (section.label === 'Admin' && userRole !== 'ADMIN') return null;

          return (
            <SidebarGroup key={section.label}>
              {!isCollapsed && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
              <SidebarMenu>
                {filteredItems.map((item) => {
                  const IconComponent = item.icon;

                  if (section.type === 'collapsible' && item.items) {
                    // Collapsible item with nested items
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip={item.title} className="font-normal!" asChild>
                            <CollapsibleTrigger>
                              <IconComponent className="size-4 shrink-0" />
                              <span>{item.title}</span>
                              <ChevronRightIcon className="ml-auto transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                            </CollapsibleTrigger>
                          </SidebarMenuButton>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>{subItem.title}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  } else {
                    // Link item
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          className="font-normal!"
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.title}
                        >
                          <Link href={item.url || '#'}>
                            <IconComponent className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Card className="mb-2 flex flex-col gap-0 rounded-md border border-primary/20 bg-linear-to-r from-primary/10 to-transparent py-2 shadow-none text-card-foreground group-data-[collapsible=icon]:hidden">
          <UICardContent className="flex items-center justify-between gap-3 px-2">
            <CreditDisplay size="sm" />
            {userPlan === 'PRO' ? (
              <span className="bg-warning/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-warning">
                <RiVipCrownLine className="size-3.5" /> Pro User
              </span>
            ) : (
              <GradientCtaButton label="Upgrade to Pro" onClick={handleOpenPurchase} size="sm" />
            )}
          </UICardContent>
        </Card>
        <UserProfileDropdown />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </ShadcnSidebar>
  );
}
