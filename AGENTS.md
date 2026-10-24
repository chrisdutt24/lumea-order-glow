<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shared-password unlock and lock navigate with a fresh document request so protected loaders always verify the current encrypted session instead of cached route state.
- Tracking lives in a browser-effect-mounted global consent component and a pure controller; consent is read on each committed navigation and synchronized across tabs to avoid cached permission and duplicate events.
- Placeholder tracking is strictly local-only, with no provider SDK or network transport; replacing IDs must not activate transmission because the health-related site requires eligibility review first.
- Persist consent notice, visitor reference, timestamp and choice history locally; preserve acceptance evidence on withdrawal and keep analytics separate from marketing.
