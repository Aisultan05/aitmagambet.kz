<script setup lang="ts">
import TheNav from './components/TheNav.vue'
import A11yPanel from './components/A11yPanel.vue'
import MastheadSection from './components/MastheadSection.vue'
import AboutSection from './components/AboutSection.vue'
import StackSection from './components/StackSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import AccessibilitySection from './components/AccessibilitySection.vue'
import ResearchSection from './components/ResearchSection.vue'
import ClientsSection from './components/ClientsSection.vue'
import EducationSection from './components/EducationSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import { useI18n } from './composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <a class="skip-link" href="#main">{{ t.ui.skipToContent }}</a>

  <div class="grain js-decor" aria-hidden="true" />

  <TheNav />
  <A11yPanel />

  <main id="main">
    <MastheadSection />
    <AboutSection />
    <StackSection />
    <ExperienceSection />
    <ProjectsSection />
    <AccessibilitySection />
    <ResearchSection />
    <ClientsSection />
    <EducationSection />
    <ContactSection />
  </main>

  <TheFooter />
</template>
