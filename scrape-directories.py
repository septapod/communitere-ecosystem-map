#!/usr/bin/env python3
"""
Organization Directory Scraper
Scrapes organization directories and exports to CSV for manual verification

Usage:
    python scrape-directories.py --source mutualaida
    python scrape-directories.py --source all

Requires: requests, beautifulsoup4, geopy
Install: pip install requests beautifulsoup4 geopy
"""

import requests
from bs4 import BeautifulSoup
import csv
import sys
import time
from datetime import datetime
from geopy.geocoders import Nominatim
from urllib.parse import urljoin
import argparse

class DirectoryScraper:
    def __init__(self):
        self.organizations = []
        self.geolocator = Nominatim(user_agent="communitere-scraper")
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }

    def geocode_location(self, location_str):
        """Get lat/long from location string"""
        try:
            location = self.geolocator.geocode(location_str)
            if location:
                return location.latitude, location.longitude
            return None, None
        except:
            return None, None

    def scrape_mutualaida_network(self):
        """
        Scrape Mutual Aid America network directory
        Reference: mutualaida.org has member networks
        """
        print("Scraping Mutual Aid America resources...")

        # Since this requires direct navigation, providing template structure
        sources = [
            {
                "name": "Mutual Aid USA Network",
                "url": "https://www.mutualaida.org/",
                "notes": "Visit site, look for 'Find Local Networks' section"
            },
            {
                "name": "Grassroots Collaborative (Chicago)",
                "url": "https://grassrootscollaborative.org/",
                "type": "Community Organizing",
                "location": "Chicago, IL"
            }
        ]

        return sources

    def scrape_propublica_nonprofits(self, keyword, limit=20):
        """
        Search ProPublica nonprofit database
        Note: This requires API or manual search at projects.propublica.org/nonprofits
        """
        print(f"Searching ProPublica for '{keyword}'...")

        # ProPublica nonprofit database search pattern
        search_url = f"https://projects.propublica.org/nonprofits/search"

        try:
            response = requests.get(search_url, params={'q': keyword}, headers=self.headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            orgs = []
            # This is a template - actual scraping depends on page structure
            for row in soup.find_all('tr', class_='result')[0:limit]:
                cells = row.find_all('td')
                if len(cells) >= 3:
                    org_name = cells[0].text.strip()
                    location = cells[1].text.strip() if len(cells) > 1 else ""
                    ein = cells[2].text.strip() if len(cells) > 2 else ""

                    org = {
                        'organization': org_name,
                        'location': location,
                        'type': 'Nonprofit (from ProPublica)',
                        'confidence_level': 'MEDIUM',
                        'notes': f'ProPublica EIN: {ein}'
                    }
                    orgs.append(org)

            return orgs
        except Exception as e:
            print(f"Error scraping ProPublica: {e}")
            return []

    def scrape_github_topics(self):
        """
        Find organizations on GitHub by topic
        Topics: mutual-aid, community-organizing, disaster-response
        """
        print("Searching GitHub for relevant projects...")

        topics = [
            'mutual-aid',
            'community-organizing',
            'disaster-response',
            'civic-tech',
            'social-impact'
        ]

        orgs = []
        for topic in topics:
            url = f"https://github.com/search?q=topic:{topic}&type=repositories"
            try:
                response = requests.get(url, headers=self.headers)
                soup = BeautifulSoup(response.content, 'html.parser')

                # This depends on GitHub's current HTML structure
                for repo in soup.find_all('div', class_='Box-row'):
                    repo_name = repo.find('a', class_='v-align-middle')
                    if repo_name:
                        org = {
                            'organization': repo_name.text.strip(),
                            'website': urljoin('https://github.com', repo_name.get('href', '')),
                            'type': 'Open Source Project',
                            'category': 'Technology/Infrastructure',
                            'confidence_level': 'LOW',
                            'notes': f'GitHub topic: {topic}'
                        }
                        orgs.append(org)

                time.sleep(1)  # Rate limit
            except Exception as e:
                print(f"Error scraping GitHub topic {topic}: {e}")

        return orgs

    def create_manual_research_list(self):
        """
        Generate research list for manual investigation
        These are high-confidence organizations to verify manually
        """
        print("Generating manual research list...")

        manual_sources = [
            # Tier 1: Mutual Aid Networks
            {
                'organization': 'Mutual Aid LA Network (MALAN)',
                'website': 'mutualaidla.org',
                'location': 'Los Angeles, CA',
                'type': 'Mutual Aid Network',
                'category': 'Mutual Aid Network',
                'scope': 'Regional',
                'tier': 'Tier 1',
                'confidence_level': 'HIGH',
                'notes': 'Known active mutual aid network'
            },
            {
                'organization': 'Bay Area Mutual Aid',
                'website': 'bayareamutualaid.org',
                'location': 'San Francisco, CA',
                'type': 'Mutual Aid Network',
                'category': 'Mutual Aid Network',
                'scope': 'Regional',
                'tier': 'Tier 1',
                'confidence_level': 'HIGH',
                'notes': 'Bay Area coordinating network'
            },
            # Tier 2: Networks
            {
                'organization': 'Grassroots Collaborative',
                'website': 'grassrootscollaborative.org',
                'location': 'Chicago, IL',
                'type': 'Community Organizing Network',
                'category': 'Community Organizing',
                'scope': 'Regional',
                'tier': 'Tier 2',
                'confidence_level': 'HIGH',
                'notes': 'Multi-issue organizing network'
            },
            {
                'organization': 'Tides Foundation',
                'website': 'tides.org',
                'location': 'San Francisco, CA',
                'type': 'Fiscal Sponsor',
                'category': 'Fiscal Sponsor',
                'scope': 'National',
                'tier': 'Tier 2',
                'confidence_level': 'HIGH',
                'notes': 'Major fiscal sponsorship network'
            },
            # Research them
            {
                'organization': 'SEARCH - United to End Racism',
                'website': 'search-racism.org',
                'location': 'Seattle, WA',
                'type': 'Community Organizing',
                'category': 'Community Organizing',
                'scope': 'Regional',
                'tier': 'Tier 1',
                'confidence_level': 'MEDIUM',
                'notes': 'Seattle-based community organizing - verify current status'
            },
        ]

        return manual_sources

    def export_to_csv(self, organizations, filename=None):
        """Export organizations to CSV file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"organizations_research_{timestamp}.csv"

        fields = [
            'organization', 'website', 'location', 'type', 'description',
            'services', 'contact', 'scope', 'founded', 'latitude', 'longitude',
            'tier', 'category', 'confidence_level', 'notes'
        ]

        try:
            with open(filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
                writer.writeheader()
                writer.writerows(organizations)
            print(f"✅ Exported {len(organizations)} organizations to {filename}")
        except Exception as e:
            print(f"❌ Error exporting to CSV: {e}")

    def run(self, source='all'):
        """Run scraper for specified source"""
        if source == 'all' or source == 'mutualaida':
            self.organizations.extend(self.scrape_mutualaida_network())

        if source == 'all' or source == 'propublica':
            for keyword in ['mutual aid', 'community organizing', 'disaster response']:
                self.organizations.extend(self.scrape_propublica_nonprofits(keyword))

        if source == 'all' or source == 'github':
            self.organizations.extend(self.scrape_github_topics())

        # Always include manual research list
        self.organizations.extend(self.create_manual_research_list())

        # Export to CSV
        self.export_to_csv(self.organizations)

        print(f"\n📊 Summary:")
        print(f"   Organizations found: {len(self.organizations)}")
        print(f"   Next step: Review CSV file, verify details, and import to database")

def main():
    parser = argparse.ArgumentParser(
        description='Scrape organization directories for ecosystem map'
    )
    parser.add_argument(
        '--source',
        choices=['all', 'mutualaida', 'propublica', 'github'],
        default='all',
        help='Data source to scrape'
    )
    parser.add_argument(
        '--output',
        type=str,
        help='Output CSV filename'
    )

    args = parser.parse_args()

    scraper = DirectoryScraper()
    scraper.run(args.source)

if __name__ == '__main__':
    main()
