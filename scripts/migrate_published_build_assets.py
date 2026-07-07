#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUPABASE_STORAGE_PREFIX = "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/"
MANIFEST = [
  {
    "build_id": "druid-balance-druid-heal-b4d6a732",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/90044905-028f-4d51-99d9-520538a9d26f/b4d6a732-32f9-410e-b984-4ce06514e2f5/talents-1782275174885-0-12706.jpg",
    "local_path": "frontend/public/images/builds/community/druid-balance-druid-heal-b4d6a732/tree1.jpg",
    "db_path": "builds/community/druid-balance-druid-heal-b4d6a732/tree1.jpg"
  },
  {
    "build_id": "druid-balance-druid-heal-b4d6a732",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/90044905-028f-4d51-99d9-520538a9d26f/b4d6a732-32f9-410e-b984-4ce06514e2f5/talents-1782275175404-1-12708.jpg",
    "local_path": "frontend/public/images/builds/community/druid-balance-druid-heal-b4d6a732/tree2.jpg",
    "db_path": "builds/community/druid-balance-druid-heal-b4d6a732/tree2.jpg"
  },
  {
    "build_id": "druid-balance-druid-heal-b4d6a732",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/90044905-028f-4d51-99d9-520538a9d26f/b4d6a732-32f9-410e-b984-4ce06514e2f5/skills-1782275173860-0-12702.jpg",
    "local_path": "frontend/public/images/builds/community/druid-balance-druid-heal-b4d6a732/skills.jpg",
    "db_path": "builds/community/druid-balance-druid-heal-b4d6a732/skills.jpg"
  },
  {
    "build_id": "druid-feral-bear-best-bear-1be3c01e",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cd27541e-ff76-4f9f-ad3e-43e9c6720c6f/1be3c01e-b572-479a-a826-1794f549f461/runes-1782477847767-0-img_1352.jpeg",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-best-bear-1be3c01e/tree1.jpeg",
    "db_path": "builds/community/druid-feral-bear-best-bear-1be3c01e/tree1.jpeg"
  },
  {
    "build_id": "druid-feral-bear-best-bear-1be3c01e",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cd27541e-ff76-4f9f-ad3e-43e9c6720c6f/1be3c01e-b572-479a-a826-1794f549f461/runes-1782477848392-1-img_1350.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-best-bear-1be3c01e/tree2.png",
    "db_path": "builds/community/druid-feral-bear-best-bear-1be3c01e/tree2.png"
  },
  {
    "build_id": "druid-feral-bear-best-bear-1be3c01e",
    "key": "tree3",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cd27541e-ff76-4f9f-ad3e-43e9c6720c6f/1be3c01e-b572-479a-a826-1794f549f461/runes-1782477850749-2-img_1349.jpeg",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-best-bear-1be3c01e/tree3.jpeg",
    "db_path": "builds/community/druid-feral-bear-best-bear-1be3c01e/tree3.jpeg"
  },
  {
    "build_id": "druid-feral-bear-best-bear-1be3c01e",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cd27541e-ff76-4f9f-ad3e-43e9c6720c6f/1be3c01e-b572-479a-a826-1794f549f461/skills-1782477845122-0-img_1353.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-best-bear-1be3c01e/skills.png",
    "db_path": "builds/community/druid-feral-bear-best-bear-1be3c01e/skills.png"
  },
  {
    "build_id": "druid-feral-bear-tank-tank-build-e7f9306b",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/e7f9306b-d172-4913-abd0-652b7a3b3342/talents-1782845240827-0-screenshot-2026-06-30-133406.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree1.png",
    "db_path": "builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree1.png"
  },
  {
    "build_id": "druid-feral-bear-tank-tank-build-e7f9306b",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/e7f9306b-d172-4913-abd0-652b7a3b3342/talents-1782845241262-1-screenshot-2026-06-30-133414.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree2.png",
    "db_path": "builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree2.png"
  },
  {
    "build_id": "druid-feral-bear-tank-tank-build-e7f9306b",
    "key": "tree3",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/e7f9306b-d172-4913-abd0-652b7a3b3342/gear-1782845241817-0-screenshot-2026-06-30-133806.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree3.png",
    "db_path": "builds/community/druid-feral-bear-tank-tank-build-e7f9306b/tree3.png"
  },
  {
    "build_id": "druid-feral-bear-tank-tank-build-e7f9306b",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/e7f9306b-d172-4913-abd0-652b7a3b3342/skills-1782845240395-0-screenshot-2026-06-30-133332.png",
    "local_path": "frontend/public/images/builds/community/druid-feral-bear-tank-tank-build-e7f9306b/skills.png",
    "db_path": "builds/community/druid-feral-bear-tank-tank-build-e7f9306b/skills.png"
  },
  {
    "build_id": "hunter-beast-new-meta-beast-244e94a5",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/244e94a5-7ee0-41b5-b484-2b12a5a01a9d/talents-1783283381339-0-screenshot-2026-07-05-151710.png",
    "local_path": "frontend/public/images/builds/community/hunter-beast-new-meta-beast-244e94a5/tree1.png",
    "db_path": "builds/community/hunter-beast-new-meta-beast-244e94a5/tree1.png"
  },
  {
    "build_id": "hunter-beast-new-meta-beast-244e94a5",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/244e94a5-7ee0-41b5-b484-2b12a5a01a9d/talents-1783283381920-1-screenshot-2026-07-05-151717.png",
    "local_path": "frontend/public/images/builds/community/hunter-beast-new-meta-beast-244e94a5/tree2.png",
    "db_path": "builds/community/hunter-beast-new-meta-beast-244e94a5/tree2.png"
  },
  {
    "build_id": "hunter-beast-new-meta-beast-244e94a5",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/244e94a5-7ee0-41b5-b484-2b12a5a01a9d/skills-1783283380787-0-screenshot-2026-07-05-151736.png",
    "local_path": "frontend/public/images/builds/community/hunter-beast-new-meta-beast-244e94a5/skills.png",
    "db_path": "builds/community/hunter-beast-new-meta-beast-244e94a5/skills.png"
  },
  {
    "build_id": "hunter-survival-hunter-main-dps-6f942f60",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/6f942f60-a1c2-40fa-b578-a5dfafabc4a2/1781616967945-0-screenshot-2026-06-16-083052.png",
    "local_path": "frontend/public/images/builds/community/hunter-survival-hunter-main-dps-6f942f60/tree1.png",
    "db_path": "builds/community/hunter-survival-hunter-main-dps-6f942f60/tree1.png"
  },
  {
    "build_id": "hunter-survival-hunter-main-dps-6f942f60",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/6f942f60-a1c2-40fa-b578-a5dfafabc4a2/1781616968704-1-screenshot-2026-06-16-083059.png",
    "local_path": "frontend/public/images/builds/community/hunter-survival-hunter-main-dps-6f942f60/tree2.png",
    "db_path": "builds/community/hunter-survival-hunter-main-dps-6f942f60/tree2.png"
  },
  {
    "build_id": "hunter-survival-hunter-main-dps-6f942f60",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/6f942f60-a1c2-40fa-b578-a5dfafabc4a2/1781616969053-2-screenshot-2026-06-16-083108.png",
    "local_path": "frontend/public/images/builds/community/hunter-survival-hunter-main-dps-6f942f60/skills.png",
    "db_path": "builds/community/hunter-survival-hunter-main-dps-6f942f60/skills.png"
  },
  {
    "build_id": "mage-fire-fire-mage-dps-7655c07e",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/7655c07e-63d6-47fe-8b50-74f8b9368696/talents-1781659754265-0-screenshot-2026-06-16-201430.png",
    "local_path": "frontend/public/images/builds/community/mage-fire-fire-mage-dps-7655c07e/tree1.png",
    "db_path": "builds/community/mage-fire-fire-mage-dps-7655c07e/tree1.png"
  },
  {
    "build_id": "mage-fire-fire-mage-dps-7655c07e",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/7655c07e-63d6-47fe-8b50-74f8b9368696/talents-1781659754955-1-screenshot-2026-06-16-201439.png",
    "local_path": "frontend/public/images/builds/community/mage-fire-fire-mage-dps-7655c07e/tree2.png",
    "db_path": "builds/community/mage-fire-fire-mage-dps-7655c07e/tree2.png"
  },
  {
    "build_id": "mage-fire-fire-mage-dps-7655c07e",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/7655c07e-63d6-47fe-8b50-74f8b9368696/skills-1781659753484-0-screenshot-2026-06-16-201414.png",
    "local_path": "frontend/public/images/builds/community/mage-fire-fire-mage-dps-7655c07e/skills.png",
    "db_path": "builds/community/mage-fire-fire-mage-dps-7655c07e/skills.png"
  },
  {
    "build_id": "paladin-prot-prot-pally-main-75417837",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/75417837-91e3-4536-afc2-1de789cfc713/1781616122565-0-screenshot-2026-06-16-081330.png",
    "local_path": "frontend/public/images/builds/community/paladin-prot-prot-pally-main-75417837/tree1.png",
    "db_path": "builds/community/paladin-prot-prot-pally-main-75417837/tree1.png"
  },
  {
    "build_id": "paladin-prot-prot-pally-main-75417837",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/75417837-91e3-4536-afc2-1de789cfc713/1781616123630-1-screenshot-2026-06-16-081337.png",
    "local_path": "frontend/public/images/builds/community/paladin-prot-prot-pally-main-75417837/tree2.png",
    "db_path": "builds/community/paladin-prot-prot-pally-main-75417837/tree2.png"
  },
  {
    "build_id": "paladin-prot-prot-pally-main-75417837",
    "key": "tree3",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/75417837-91e3-4536-afc2-1de789cfc713/1781616124395-3-screenshot-2026-06-16-081725.png",
    "local_path": "frontend/public/images/builds/community/paladin-prot-prot-pally-main-75417837/tree3.png",
    "db_path": "builds/community/paladin-prot-prot-pally-main-75417837/tree3.png"
  },
  {
    "build_id": "paladin-prot-prot-pally-main-75417837",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/75417837-91e3-4536-afc2-1de789cfc713/1781616124058-2-screenshot-2026-06-16-081347.png",
    "local_path": "frontend/public/images/builds/community/paladin-prot-prot-pally-main-75417837/skills.png",
    "db_path": "builds/community/paladin-prot-prot-pally-main-75417837/skills.png"
  },
  {
    "build_id": "priest-holy-knocks-holy-priest-42caec8f",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/42caec8f-9665-4a67-a418-83e5183056dc/1781615136973-0-screenshot-2026-06-16-075646.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-knocks-holy-priest-42caec8f/tree1.png",
    "db_path": "builds/community/priest-holy-knocks-holy-priest-42caec8f/tree1.png"
  },
  {
    "build_id": "priest-holy-knocks-holy-priest-42caec8f",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/42caec8f-9665-4a67-a418-83e5183056dc/1781615137960-1-screenshot-2026-06-16-075652.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-knocks-holy-priest-42caec8f/tree2.png",
    "db_path": "builds/community/priest-holy-knocks-holy-priest-42caec8f/tree2.png"
  },
  {
    "build_id": "priest-holy-knocks-holy-priest-42caec8f",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/42caec8f-9665-4a67-a418-83e5183056dc/1781615138297-2-screenshot-2026-06-16-080148.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-knocks-holy-priest-42caec8f/skills.png",
    "db_path": "builds/community/priest-holy-knocks-holy-priest-42caec8f/skills.png"
  },
  {
    "build_id": "priest-holy-priest-afk-heals-cfbdea3f",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cfbdea3f-3f0d-4d42-86d7-055806de394e/1781615450251-0-screenshot-2026-06-16-075646.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-priest-afk-heals-cfbdea3f/tree1.png",
    "db_path": "builds/community/priest-holy-priest-afk-heals-cfbdea3f/tree1.png"
  },
  {
    "build_id": "priest-holy-priest-afk-heals-cfbdea3f",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cfbdea3f-3f0d-4d42-86d7-055806de394e/1781615451237-1-screenshot-2026-06-16-075652.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-priest-afk-heals-cfbdea3f/tree2.png",
    "db_path": "builds/community/priest-holy-priest-afk-heals-cfbdea3f/tree2.png"
  },
  {
    "build_id": "priest-holy-priest-afk-heals-cfbdea3f",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/cfbdea3f-3f0d-4d42-86d7-055806de394e/1781615451644-2-screenshot-2026-06-16-080820.png",
    "local_path": "frontend/public/images/builds/community/priest-holy-priest-afk-heals-cfbdea3f/skills.png",
    "db_path": "builds/community/priest-holy-priest-afk-heals-cfbdea3f/skills.png"
  },
  {
    "build_id": "rogue-outlaw-raid-dungeons-30033679",
    "key": "tree1",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/30033679-c997-420b-9175-9a9e33896ba0/talents-1782141617137-0-screenshot-2026-06-22-080814.png",
    "local_path": "frontend/public/images/builds/community/rogue-outlaw-raid-dungeons-30033679/tree1.png",
    "db_path": "builds/community/rogue-outlaw-raid-dungeons-30033679/tree1.png"
  },
  {
    "build_id": "rogue-outlaw-raid-dungeons-30033679",
    "key": "tree2",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/30033679-c997-420b-9175-9a9e33896ba0/talents-1782141618074-1-screenshot-2026-06-22-080823.png",
    "local_path": "frontend/public/images/builds/community/rogue-outlaw-raid-dungeons-30033679/tree2.png",
    "db_path": "builds/community/rogue-outlaw-raid-dungeons-30033679/tree2.png"
  },
  {
    "build_id": "rogue-outlaw-raid-dungeons-30033679",
    "key": "tree3",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/30033679-c997-420b-9175-9a9e33896ba0/gear-1782141618578-0-screenshot-2026-06-22-080930.png",
    "local_path": "frontend/public/images/builds/community/rogue-outlaw-raid-dungeons-30033679/tree3.png",
    "db_path": "builds/community/rogue-outlaw-raid-dungeons-30033679/tree3.png"
  },
  {
    "build_id": "rogue-outlaw-raid-dungeons-30033679",
    "key": "skills",
    "url": "https://mmjplyofgdpaqajaxjbc.supabase.co/storage/v1/object/public/build-submissions/5afaabf4-ccb0-457f-83e6-3011bd272de6/30033679-c997-420b-9175-9a9e33896ba0/skills-1782141616180-0-screenshot-2026-06-22-080804.png",
    "local_path": "frontend/public/images/builds/community/rogue-outlaw-raid-dungeons-30033679/skills.png",
    "db_path": "builds/community/rogue-outlaw-raid-dungeons-30033679/skills.png"
  }
]


def patch_once(path: Path, old: str, new: str, marker: str) -> None:
    text = path.read_text(encoding="utf-8")
    if marker in text:
        return
    if old not in text:
        raise RuntimeError(f"Patch target not found in {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


def apply_public_egress_guards() -> None:
    api_path = ROOT / "frontend/src/lib/api.ts"
    patch_once(
        api_path,
        """// ============================================
// STORAGE HELPERS
// ============================================

export const storage = {
  getUrl: (path: string | null | undefined) => {
    if (!path) return null
    if (path.includes('://')) return path
    return `/images/${path}`
  },""",
        """// ============================================
// STORAGE HELPERS
// ============================================

const SUPABASE_STORAGE_PREFIX = 'https://mmjplyofgdpaqajaxjbc.supabase.co/storage/'

export const storage = {
  getUrl: (path: string | null | undefined) => {
    if (!path) return null
    // Published content must be served as static site assets, not from Supabase Storage.
    // Submission/admin previews still use the direct Storage helper in admin.ts.
    if (path.startsWith(SUPABASE_STORAGE_PREFIX)) return null
    if (path.includes('://')) return path
    return `/images/${path}`
  },""",
        "Published content must be served as static site assets",
    )

    builds_path = ROOT / "frontend/src/pages/Builds.tsx"
    patch_once(
        builds_path,
        """  const colors = classColors[build.hero_class.toLowerCase()] || classColors.hunter;
  const views = getViewCount(build);

  return (""",
        """  const colors = classColors[build.hero_class.toLowerCase()] || classColors.hunter;
  const views = getViewCount(build);
  const previewImage = storage.getUrl(build.images?.skills);

  return (""",
        "const previewImage = storage.getUrl(build.images?.skills);",
    )
    patch_once(
        builds_path,
        """            {build.images?.skills && (
              <img
                src={storage.getUrl(build.images.skills) || ""}
                alt={`${build.hero_class} ${build.spec} Skills`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
              />
            )}""",
        """            {previewImage && (
              <img
                src={previewImage}
                alt={`${build.hero_class} ${build.spec} Skills`}
                loading="lazy"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
              />
            )}""",
        "loading=\"lazy\"",
    )

    preview_path = ROOT / "frontend/netlify/edge-functions/social-preview.ts"
    patch_once(
        preview_path,
        """function absoluteUrl(path?: string | null) {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;""",
        """function absoluteUrl(path?: string | null) {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith(SUPABASE_STORAGE_PREFIX)) return DEFAULT_IMAGE;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;""",
        "path.startsWith(SUPABASE_STORAGE_PREFIX)",
    )
    patch_once(
        preview_path,
        """const DEFAULT_IMAGE = `${SITE_URL}/images/og/mini-legion-og.svg`;""",
        """const DEFAULT_IMAGE = `${SITE_URL}/images/og/mini-legion-og.svg`;
const SUPABASE_STORAGE_PREFIX = 'https://mmjplyofgdpaqajaxjbc.supabase.co/storage/';""",
        "const SUPABASE_STORAGE_PREFIX = 'https://mmjplyofgdpaqajaxjbc.supabase.co/storage/';",
    )


def valid_image(data: bytes) -> bool:
    return (
        data.startswith(b"\x89PNG\r\n\x1a\n")
        or data.startswith(b"\xff\xd8\xff")
        or data.startswith(b"RIFF") and data[8:12] == b"WEBP"
    )


def download_all() -> bool:
    staging = Path(tempfile.mkdtemp(prefix="mini-legion-assets-"))
    failures: list[str] = []

    try:
        for item in MANIFEST:
            url = item["url"]
            relative = Path(item["local_path"]).relative_to("frontend/public/images/builds/community")
            target = staging / relative
            target.parent.mkdir(parents=True, exist_ok=True)

            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mini-Legion-Static-Asset-Migrator/1.0",
                    "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*",
                },
            )
            try:
                with urllib.request.urlopen(request, timeout=45) as response:
                    data = response.read()
                    content_type = response.headers.get("content-type", "")
                    if response.status != 200 or not content_type.startswith("image/") or not valid_image(data):
                        raise RuntimeError(
                            f"unexpected response status={response.status} content-type={content_type} bytes={len(data)}"
                        )
                    target.write_bytes(data)
                    print(f"Downloaded {item['build_id']}/{item['key']} ({len(data)} bytes)")
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, RuntimeError) as exc:
                failures.append(f"{item['build_id']}/{item['key']}: {exc}")

        if failures:
            print("Supabase Storage is not ready for the one-time migration:", file=sys.stderr)
            for failure in failures:
                print(f"  - {failure}", file=sys.stderr)
            return False

        final_root = ROOT / "frontend/public/images/builds/community"
        for item in MANIFEST:
            relative = Path(item["local_path"]).relative_to("frontend/public/images/builds/community")
            source = staging / relative
            destination = ROOT / item["local_path"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)

        marker = ROOT / "frontend/public/deploy-markers/static-build-assets-ready.json"
        marker.parent.mkdir(parents=True, exist_ok=True)
        marker.write_text(
            json.dumps(
                {
                    "status": "ready",
                    "asset_count": len(MANIFEST),
                    "supabase_storage_prefix": SUPABASE_STORAGE_PREFIX,
                    "assets": MANIFEST,
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        return True
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def set_output(name: str, value: str) -> None:
    output = os.getenv("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as handle:
            handle.write(f"{name}={value}\n")


def main() -> int:
    apply_public_egress_guards()
    ready = download_all()
    set_output("assets_ready", "true" if ready else "false")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
