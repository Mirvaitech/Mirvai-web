import React, { useId } from 'react';
import {
  categoryLabel,
  formatCardLocation,
  formatListingPrice,
  HomeListing,
  resolveListingImage,
  truncateDescription,
} from '../lib/courtyardReview';
import { listingPricePair, shortPropertyTitle } from '../lib/listingPresentation';
import type { UsdRateState } from '../lib/listingPresentation';

interface PropertyCardProps {
  item: HomeListing;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onOpenProperty: (id: string) => void;
  compact?: boolean;
  websiteRate?: UsdRateState;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onOpenProperty,
  compact = false,
  websiteRate,
}) => {
  const descriptionId = useId();
  const art = resolveListingImage(item);
  const badgeText =
    !item.status || item.status === 'Available'
      ? 'FOR SALE'
      : item.status.toUpperCase();
  const { preview, truncated } = truncateDescription(
    item.description,
    compact ? 46 : 66
  );
  const features = (item.features || []).slice(0, 4);
  const allFeatures = item.features || [];
  const title = websiteRate ? shortPropertyTitle(item) : item.name;
  const prices = websiteRate ? listingPricePair(item.price, item.currency, websiteRate) : null;

  return (
    <article className={`luxury-card ${compact ? 'is-compact' : ''}`}>
      <div className="luxury-card-media-wrap">
        <button
          type="button"
          className="luxury-card-media"
          aria-label={`View ${item.name}`}
          onClick={() => onOpenProperty(item.id)}
        >
          {art ? (
            <img
              loading="lazy"
              src={art.src}
              alt={art.alt}
              width={1050}
              height={700}
            />
          ) : (
            <span className="image-placeholder">
              <svg aria-hidden="true">
                <use href="#i-home" />
              </svg>{' '}
              Property preview
            </span>
          )}
          <span className="luxury-card-status">{badgeText}</span>
        </button>
      </div>

      <div className="luxury-card-body">
        {!websiteRate && <p className="luxury-card-kicker">{categoryLabel(item.type).toUpperCase()}</p>}

        <h3 className="luxury-card-title">
          <button type="button" onClick={() => onOpenProperty(item.id)}>
            {title}
          </button>
        </h3>

        <p className="luxury-card-location">{formatCardLocation(item.locale)}</p>

        {prices ? (
          <div className="luxury-card-price">
            <span>{prices.naira}</span>
            {prices.dollars && <span className="luxury-card-price-secondary">{prices.dollars}</span>}
          </div>
        ) : (
          <p className="luxury-card-price">{formatListingPrice(item.price, item.currency)}</p>
        )}

        {websiteRate ? (
          <div className="luxury-card-desc">
            <button
              type="button"
              className="luxury-card-desc-link"
              aria-expanded={isExpanded}
              aria-controls={descriptionId}
              onClick={() => onToggleExpand(item.id)}
            >
              {isExpanded ? 'Hide description' : 'View description'}
            </button>
            <div className="luxury-card-expanded" id={descriptionId} hidden={!isExpanded}>
              {title !== item.name && <p>{item.name}</p>}
              {item.description && <p>{item.description}</p>}
              {allFeatures.length > 0 && (
                <ul className="luxury-card-features" aria-label="Property highlights">
                  {allFeatures.map((feat, idx) => (
                    <li key={`${item.id}-feat-${idx}`}>{feat}</li>
                  ))}
                </ul>
              )}
              {!item.description && allFeatures.length === 0 && title === item.name && (
                <p>No description has been added yet.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="luxury-card-desc">
              <p>
                {isExpanded || !truncated ? item.description : preview}{' '}
                <button
                  type="button"
                  className="luxury-card-desc-link"
                  aria-expanded={isExpanded}
                  onClick={() => onToggleExpand(item.id)}
                >
                  {isExpanded ? 'Show less' : 'View full description'}
                </button>
              </p>
            </div>
            {features.length > 0 && (
              <ul className="luxury-card-features" aria-label="Property highlights">
                {features.map((feat, idx) => (
                  <li key={`${item.id}-feat-${idx}`}>{feat}</li>
                ))}
              </ul>
            )}
          </>
        )}

        <button
          type="button"
          className="luxury-card-cta"
          onClick={() => onOpenProperty(item.id)}
        >
          View Details
        </button>
      </div>
    </article>
  );
};
